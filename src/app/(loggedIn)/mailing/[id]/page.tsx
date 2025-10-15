import {SiteHeader} from "@/components/site-header";
import {fetchContacts, fetchMailingById} from "@/lib/data/mailings";
import MailingForm from "@/app/(loggedIn)/mailing/[id]/MailingForm";

export default async function MailingPage(props: PageProps<'/mailing/[id]'>) {
    const {id} = await props.params;
    const mailing = await fetchMailingById(id);
    if (!mailing.success) {
        return mailing.error;
    }
    const contactsResult = await fetchContacts(id);
    if (!contactsResult.success) {
        return contactsResult.error;
    }
    const {project, house_number, collect_status, created_at} = mailing.data!;
    const title = `Рассылка для ${project} Дом №${house_number} от ${created_at.toLocaleDateString()} ${created_at.toLocaleTimeString()}`;

    return (
        <>
            <SiteHeader title={title}/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                        <MailingForm mailingId={id} collectStatus={collect_status} contacts={contactsResult.data!}/>
                    </div>
                </div>
            </div>
        </>)
}