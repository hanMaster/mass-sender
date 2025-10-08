import {SiteHeader} from "@/components/site-header";
import {Button} from "@/components/ui/button";
import {prepareFile} from "@/lib/fillTemplate";

export default async function FilesPage() {
    return (
        <>
            <SiteHeader title={"Файлы уведомлений"}/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <h1>Файлы уведомлений</h1>
                        <Button className='bg-primary' onClick={prepareFile}>Создать файл уведомления</Button>
                    </div>
                </div>
            </div>
        </>
    )
}