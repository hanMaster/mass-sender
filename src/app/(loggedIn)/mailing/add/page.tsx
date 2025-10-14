import AddMailingForm from "@/app/(loggedIn)/mailing/add/AddMailingForm";
import {SiteHeader} from "@/components/site-header";
import {fetchNotificationsForSelect} from "@/lib/data/notifications";
import {getHouseNumbersForSelect} from "@/lib/utils";

export default async function AddMailingPage() {
    const notifications = await fetchNotificationsForSelect();
    const houseNumbers = getHouseNumbersForSelect();

    return (
        <>
            <SiteHeader title={"Создание новой рассылки"}/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <AddMailingForm notifications={notifications} houses={houseNumbers} />
                    </div>
                </div>
            </div>
        </>

    )
}