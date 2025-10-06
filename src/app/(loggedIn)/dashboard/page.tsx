import {getSession} from "@/app/lib/dal";
import {SiteHeader} from "@/components/site-header";
import {SectionCards} from "@/components/section-cards";
import {DataTable} from "@/components/data-table";
import data from "@/app/(loggedIn)/dashboard/data.json";
import "./theme.css"

export default async function DashboardPage() {
    const session = await getSession();
    const userRole = session.user?.role;

    return (
        <>
            <SiteHeader title={userRole === 'admin' ? "Admin Dashboard" : "User Dashboard"}/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards/>
                        <DataTable data={data}/>
                    </div>
                </div>
            </div>
        </>
    )
}
