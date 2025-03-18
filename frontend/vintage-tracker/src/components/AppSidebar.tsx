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
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {user ?
                <SidebarGroup>
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
                <SidebarGroup>
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