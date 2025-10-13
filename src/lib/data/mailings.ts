'use server';

import postgres from "postgres";
import {MailingForAdd, Mailings, Result} from "@/lib/data/definitions";
import {revalidatePath} from "next/cache";

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

export async function addMailing(p: MailingForAdd): Promise<Result<void>> {
    try {
        const {project, houseNumber, notificationId} = p;
        await sql`
            INSERT INTO mailings (project, house_number, notification_id)
            VALUES (${project}, ${houseNumber}, ${notificationId})
        `;
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