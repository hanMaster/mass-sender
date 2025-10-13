import {SiteHeader} from "@/components/site-header";
import MailingTable from "@/app/(loggedIn)/mailing/MailingTable";

export default function MailingPage() {
    return (
        <>
            <SiteHeader title={"Рассылки"}/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                        <MailingTable/>
                    </div>
                </div>
            </div>
        </>
    )
}