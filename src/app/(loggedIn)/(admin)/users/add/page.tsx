import {SiteHeader} from "@/components/site-header";
import AddUserForm from "@/app/(loggedIn)/(admin)/users/add/AddUserForm";

export default function AddUserPage() {
    return (
        <>
            <SiteHeader title={"Добавление нового пользователя"}/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <AddUserForm/>
                    </div>
                </div>
            </div>
        </>
    )
}