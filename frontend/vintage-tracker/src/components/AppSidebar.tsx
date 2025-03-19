'use client'

import React from "react";
import Link from "next/link";
import { useAuth } from '../context/AuthProvider';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"; 
import { Home, Search, Settings } from "lucide-react";


const menuItems = [
    {
        title: "Home",
        url: "/",
        icon: Home
    },
    {
        title: "Search",
        url: "/search",
        icon: Search
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings
    }
]

export const AppSidebar = () => {
    const { user, signOut } = useAuth();

    return (
        <Sidebar>
            <SidebarHeader>
                Vintdex
            </SidebarHeader>

            <SidebarContent className="flex flex-col h-full">
                <div>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menuItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                <div className="flex items-center gap-2">
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </div>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </div>

                {/* Sign In/Out at the bottom */}
                {user ?
                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={signOut}>
                                    <span>Sign Out</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                : 
                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="/login">
                                        <span>Log In</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <a href="/signup">
                                        <span>Sign Up</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                }
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}