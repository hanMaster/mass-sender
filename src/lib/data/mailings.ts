'use server';

import postgres from "postgres";
import {MailingForAdd, Mailings, MailListRecord, Result} from "@/lib/data/definitions";
import {revalidatePath} from "next/cache";
import {FullContact} from "@/lib/api/amo-crm";
import {collectContacts} from "@/lib/api/collect-contacts";

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

export async function fetchMailings(): Promise<Result<Mailings[]>> {
    try {
        const data = await sql<Mailings[]>`
            select mailings.id,
                   mailings.project,
                   mailings.house_number,
                   notifications.comment as notification_comment,
                   mailings.is_mail_sent,
                   mailings.created_at,
                   mailings.deleted_at
            from mailings
                     INNER JOIN notifications on notification_id = notifications.id;
        `;
        return {success: true, data};
    } catch (error: any) {
        console.error('Database Error:', error);
        return {success: false, error: error.message};
    }
}

export async function fetchMailingById(id: string): Promise<Result<Mailings>> {
    try {
        const data = await sql<Mailings[]>`
            select mailings.id,
                   mailings.project,
                   mailings.house_number,
                   notifications.comment as notification_comment,
                   mailings.collect_status,
                   mailings.is_mail_sent,
                   mailings.created_at,
                   mailings.deleted_at
            from mailings
                     INNER JOIN notifications on notification_id = notifications.id
            WHERE mailings.id = ${id};
        `;
        if (!data.length) return {success: false, error: 'Record not found'};
        return {success: true, data: data[0]};
    } catch (error: any) {
        console.error('Database Error:', error);
        return {success: false, error: error.message};
    }
}

export async function addMailing(p: MailingForAdd): Promise<Result<void>> {
    try {
        const {project, houseNumber, notificationId} = p;
        const res = await sql`
            INSERT INTO mailings (project, house_number, notification_id)
            VALUES (${project}, ${houseNumber}, ${notificationId})
            RETURNING id
        `;
        const mailingId = res[0].id as string;
        collectContacts(mailingId, project, houseNumber);
        return {success: true};
    } catch (error: any) {
        console.log('Database Error: Failed to add mailing.', error);
        return {success: false, error: error.message};
    }
}

export async function removeMailing(id: string): Promise<Result<void>> {
    try {
        await sql`DELETE
                  FROM mail_list
                  WHERE mailing_id = ${id}`;

        await sql`DELETE
                  FROM mailings
                  WHERE id = ${id}`;
        revalidatePath('/mailing');
        return {success: true};
    } catch {
        return {success: false, error: 'Failed to remove mailing.'};
    }
}

export async function saveCollectStatus(id: string, status: string) {
    return sql`
        UPDATE mailings
        SET collect_status = ${status}
        WHERE id = ${id};
    `;
}

export async function saveContacts(mailingId: string, contacts: FullContact[]) {
    const values = contacts.map(c => (
        {
            funnel: c.funnel,
            dealId: c.leadId,
            objectType: 'Квартира',
            objNumber: '12',
            full_name: `${c.last_name} ${c.middle_name} ${c.first_name}`,
            isMain: c.isMain,
            phone: c.phone,
            email: c.email
        }));
    console.log('Saving...');
    try {
        for (const v of values) {
            await sql`
                INSERT INTO mail_list (mailing_id, funnel, deal_id, object_type, object_number,
                                       full_name, is_main_contact, phone, email)
                VALUES (${mailingId}, ${v.funnel}, ${v.dealId}, ${v.objectType},
                        ${v.objNumber},
                        ${v.full_name}, ${v.isMain},
                        ${v.phone}, ${v.email});
            `;
        }
        await saveCollectStatus(mailingId, 'done');
    } catch (error) {
        console.error('Database Error:', error);
        await saveCollectStatus(mailingId, error as string);
    }
}

export async function fetchContacts(mailingId: string): Promise<Result<MailListRecord[]>> {
    try {
        const data = await sql<MailListRecord[]>`
            select *
            from mail_list
            WHERE mailing_id = ${mailingId};
        `;
        return {success: true, data};
    } catch (error: any) {
        console.error('Database Error:', error);
        return {success: false, error: error.message};
    }
}

export async function cleanContacts(mailingId: string): Promise<Result<void>> {
    try {
        await sql`
            DELETE
            FROM mail_list
            WHERE mailing_id = ${mailingId};
        `;
        return {success: true};
    } catch (error: any) {
        console.error('Database Error:', error);
        return {success: false, error: error.message};
    }
}