"use client"

import * as React from "react"
import {IconDashboard, IconInnerShadowTop, IconListDetails,} from "@tabler/icons-react"

import {NavMain} from "@/components/nav-main"
import {NavUser} from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {SessionPayload} from "@/app/lib/session";

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            icon: IconDashboard,
        },
        {
            title: "Lifecycle",
            url: "#",
            icon: IconListDetails,
        }
    ],
}

export function AppSidebar({user, ...props}: React.ComponentProps<typeof Sidebar> & { user: SessionPayload }) {

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="/dashboard">
                                <IconInnerShadowTop className="!size-5"/>
                                <span className="text-base font-semibold">Mass Sender</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user}/>
            </SidebarFooter>
        </Sidebar>
    )
}
