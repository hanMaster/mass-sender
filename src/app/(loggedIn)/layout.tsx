import {CSSProperties, ReactNode} from "react";
import {getSession} from "@/lib/dal";
import {redirect} from "next/navigation";
import {SessionPayload} from "@/lib/session";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";

export default async function LoggedInLayout({children}: Readonly<{ children: ReactNode }>) {
    const session = await getSession();
    const userRole = session.user?.role;
    if (!userRole) {
        redirect('/login');
    }

    const user = session.user as SessionPayload;

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
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}