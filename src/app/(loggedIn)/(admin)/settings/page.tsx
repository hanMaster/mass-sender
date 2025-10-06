import {SiteHeader} from "@/components/site-header";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function SettingsPage() {
    return (
        <>
            <SiteHeader title={"Настройки"}/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex gap-4 p-4 md:gap-6 md:p-6">
                        <Button variant="link">
                            <Link href="/template">Шаблон уведомления</Link>
                        </Button>
                        <Button variant="link">
                            <Link href="/users">Пользователи</Link>
                        </Button>
                        <Button variant="link">
                            <Link href="/users">Настройки доступа AmoCRM</Link>
                        </Button>
                        <Button variant="link">
                            <Link href="/users">Настройки доступа Profitbase</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}