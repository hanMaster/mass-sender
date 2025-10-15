'use server';

import {cleanContacts, fetchMailingById, saveCollectStatus} from "@/lib/data/mailings";
import {revalidatePath} from "next/cache";
import {collectContacts} from "@/lib/api/collect-contacts";

export async function recollectContacts(formData: FormData) {
    const mailingId = formData.get('mailingId') as string;
    console.log('[recollectContacts] for mailingId: ', mailingId);
    const cleanResult = await cleanContacts(mailingId);
    if (!cleanResult.success) {
        console.log('[recollectContacts] clean failed: ', cleanResult.error);
        await saveCollectStatus(mailingId, cleanResult.error!);
        return;
    }
    await saveCollectStatus(mailingId, 'in progress');
    revalidatePath(`/mailing/${mailingId}`);
    const mailing = await fetchMailingById(mailingId);
    if (!mailing.success) {
        console.log('Failed to fetch mailing: ', mailingId);
    }
    collectContacts(mailingId, mailing.data!.project, mailing.data!.house_number);
}

export async function testProfit() {

}