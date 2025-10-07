import {SiteHeader} from "@/components/site-header";
import DocumentUploadForm from "@/app/(loggedIn)/templates/add/DocumentUploadForm";

export default function TemplatePage() {
    return (
        <>
            <SiteHeader title={"Шаблон уведомления"}/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <DocumentUploadForm/>
                    </div>
                </div>
            </div>
        </>
    )
}