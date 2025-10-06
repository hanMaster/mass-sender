import {SiteHeader} from "@/components/site-header";
import TemplateForm from "@/app/(loggedIn)/(admin)/template/TemplateForm";

export default function TemplatePage() {
    return (
        <>
            <SiteHeader title={"Шаблон уведомления"}/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <TemplateForm/>
                    </div>
                </div>
            </div>
        </>
    )
}