import {CSSProperties} from "react";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {SiteHeader} from "@/components/site-header";
import {SectionCards} from "@/components/section-cards";
import {DataTable} from "@/components/data-table";
import data from "@/app/dashboard/data.json";
import {SessionPayload} from "@/app/lib/session";

export default function UserDashboard({user}: { user: SessionPayload }) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as CSSProperties
            }
        >
            <AppSidebar variant="inset" user={user}/>
            <SidebarInset>
                <SiteHeader title={"User Dashboard"}/>
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <SectionCards/>
                            <DataTable data={data}/>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}