import {collectWaitingLeads, getAmoLeadsByProject} from "@/lib/api/amo-crm";
import {saveCollectStatus, saveContacts} from "@/lib/data/mailings";

export async function collectContacts(mailingId: string, project: string, houseNumber: string) {
    const contactsResult = await getAmoLeadsByProject(mailingId, project, houseNumber);
    if (!contactsResult.success) {
        console.log('Collect Error: mailingId: ', mailingId, contactsResult.error);
        return saveCollectStatus(mailingId, contactsResult.error as string);
    }

    // Parse waiting funnel
    const waitingResult = await collectWaitingLeads(mailingId, project, houseNumber);
    if (!waitingResult.success) {
        console.log('Collect Error: mailingId: ', mailingId, waitingResult.error);
        return saveCollectStatus(mailingId, waitingResult.error as string);
    }

    const contacts = [...contactsResult.data!, ...waitingResult.data!];

    await saveContacts(mailingId, contacts);
    console.log('Successfully collecting contacts for mailingId: ', mailingId);

}