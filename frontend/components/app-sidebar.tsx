"use client"

import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  Users,
  DoorOpen,
  LayoutDashboard,
  Receipt,
  FileText,
  Shield,
  Bell,
  Settings,
  UserCircle,
  ClipboardList,
  Home,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  roles: ("admin" | "employee" | "resident")[]
}

const mainNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "employee", "resident"] },
]

const adminNav: NavItem[] = [
  { title: "Unidades", href: "/admin/units", icon: Building2, roles: ["admin"] },
  { title: "Moradores", href: "/admin/residents", icon: Users, roles: ["admin"] },
  { title: "Funcionarios", href: "/admin/employees", icon: UserCircle, roles: ["admin"] },
  { title: "Comunicados", href: "/admin/announcements", icon: Bell, roles: ["admin"] },
  { title: "Auditoria", href: "/admin/audit", icon: Shield, roles: ["admin"] },
]

const doormanNav: NavItem[] = [
  { title: "Portaria", href: "/doorman", icon: DoorOpen, roles: ["admin", "employee"] },
  { title: "Visitantes", href: "/doorman/visitors", icon: Users, roles: ["admin", "employee"] },
  { title: "Ocorrencias", href: "/doorman/occurrences", icon: ClipboardList, roles: ["admin", "employee"] },
]

const residentNav: NavItem[] = [
  { title: "Minha Unidade", href: "/resident/unit", icon: Home, roles: ["resident"] },
  { title: "Pre-cadastro", href: "/resident/visitors", icon: Users, roles: ["resident"] },
  { title: "Comunicados", href: "/resident/announcements", icon: Bell, roles: ["resident"] },
]

const financeNav: NavItem[] = [
  { title: "Cobrancas", href: "/resident/billing", icon: Receipt, roles: ["admin", "resident"] },
  { title: "Relatorios", href: "/admin/financial", icon: FileText, roles: ["admin"] },
]

export function AppSidebar() {
  const { user, hasPermission } = useAuth()
  const pathname = usePathname()

  const filterByRole = (items: NavItem[]) =>
    items.filter((item) => hasPermission(item.roles))

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">CondoGest</span>
                  <span className="truncate text-xs text-muted-foreground">Gestao Condominial</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterByRole(mainNav).map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user?.role === "admin" && filterByRole(adminNav).length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Administracao</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filterByRole(adminNav).map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {(user?.role === "admin" || user?.role === "employee") && filterByRole(doormanNav).length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Portaria</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filterByRole(doormanNav).map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {user?.role === "resident" && filterByRole(residentNav).length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Morador</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filterByRole(residentNav).map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {filterByRole(financeNav).length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Financeiro</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filterByRole(financeNav).map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Configuracoes">
              <Link href="/settings">
                <Settings className="size-4" />
                <span>Configuracoes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
