import {FullContact, getAmoLeadsByProject} from "@/lib/api/amo-crm";
import {saveCollectStatus, saveContacts} from "@/lib/data/mailings";

export async function collectContacts(mailingId: string, project: string, houseNumber: string) {
    const contactsResult = await getAmoLeadsByProject(project, houseNumber);
    if (!contactsResult.success) {
        console.log('Collect Error: mailingId: ', mailingId, contactsResult.error);
        return saveCollectStatus(mailingId, contactsResult.error as string);
    }

    await saveContacts(mailingId, contactsResult.data as FullContact[]);
    console.log('Successfully collecting contacts for mailingId: ', mailingId);

}