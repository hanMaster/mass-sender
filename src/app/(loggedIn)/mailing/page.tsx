import {SiteHeader} from "@/components/site-header";

export default function MailingPage() {
    return (
        <>
            <SiteHeader title={"Рассылки"}/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <h1>Рассылки</h1>
                    </div>
                </div>
            </div>
        </>
    )
}