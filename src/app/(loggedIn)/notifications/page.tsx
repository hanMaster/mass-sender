import {SiteHeader} from "@/components/site-header";
import NotificationsTable from "@/app/(loggedIn)/notifications/NotificationsTable";

export default async function NotificationsPage() {
    return (
        <>
            <SiteHeader title={"Файлы уведомлений"}/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                        <NotificationsTable/>
                    </div>
                </div>
            </div>
        </>
    )
}