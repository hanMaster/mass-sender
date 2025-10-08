"use client"

import * as React from "react"
import {
    IconBrandMailgun,
    IconFileFilled,
    IconFileTypeDocx,
    IconInnerShadowTop,
    IconMailFilled,
    IconSettingsCog, IconUserCog,
} from "@tabler/icons-react"

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
import {SessionPayload} from "@/lib/session";

const data = {
    navMain: [
        {
            title: "Шаблоны",
            url: "/templates",
            icon: IconFileTypeDocx,
        },
        {
            title: "Файлы",
            url: "/files",
            icon: IconFileFilled,
        },
        {
            title: "Рассылки",
            url: "/mailing",
            icon: IconMailFilled,
        }
    ],
    navAdmin: [
        {
            title: "Пользователи",
            url: "/users",
            icon: IconUserCog,
        }
    ]
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
                                <IconBrandMailgun className="!size-5"/>
                                <span className="text-base font-semibold">Mass Sender</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={user.role === 'admin' ? [...data.navMain, ...data.navAdmin] : data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user}/>
            </SidebarFooter>
        </Sidebar>
    )
}
