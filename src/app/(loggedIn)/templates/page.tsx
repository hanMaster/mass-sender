import {SiteHeader} from "@/components/site-header";
import TemplatesTable from "@/app/(loggedIn)/templates/Table";

export default async function TemplatesPage() {
    return (
        <>
            <SiteHeader title={"Шаблоны уведомлений"}/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                        <TemplatesTable/>
                    </div>
                </div>
            </div>
        </>
    )
}