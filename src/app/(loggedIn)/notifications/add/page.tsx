import {SiteHeader} from "@/components/site-header";
import AddNotificationForm from "@/app/(loggedIn)/notifications/add/AddNotificationForm";

export default function AddNotificationsPage() {
    return (
        <>
            <SiteHeader title={"Добавление нового уведомления"}/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <AddNotificationForm />
                    </div>
                </div>
            </div>
        </>
    )
}