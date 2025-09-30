import { useState } from "react";
import { 
  Home, 
  Building2, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  ClipboardList,
  MapPin,
  AlertTriangle
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Projects", url: "/projects", icon: Building2 },
  { title: "Timeline", url: "/timeline", icon: Calendar },
  { title: "Budget", url: "/budget", icon: DollarSign },
  { title: "Team", url: "/team", icon: Users },
];

const planningItems = [
  { title: "Permits", url: "/permits", icon: FileText },
  { title: "Site Survey", url: "/site-survey", icon: MapPin },
  { title: "Tasks", url: "/tasks", icon: ClipboardList },
  { title: "Risks", url: "/risks", icon: AlertTriangle },
];

const systemItems = [
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isMainGroupExpanded = mainItems.some((item) => isActive(item.url));
  const isPlanningGroupExpanded = planningItems.some((item) => isActive(item.url));
  const isSystemGroupExpanded = systemItems.some((item) => isActive(item.url));

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-construction-primary/10 text-construction-primary border-r-2 border-construction-primary font-medium" 
      : "text-muted-foreground hover:bg-construction-surface/50 hover:text-foreground";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
    >
      <SidebarContent className="bg-card border-r border-construction-grid/50">
        {/* Logo section */}
        <div className="p-4 border-b border-construction-grid/50">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-construction-primary to-construction-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <h1 className="text-lg font-bold text-foreground">ConstructPlan</h1>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-construction-primary to-construction-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Planning Tools */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Planning
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {planningItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}