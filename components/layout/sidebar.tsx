"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/lib/stores/ui-store"
import { useAuth } from "@/lib/hooks/use-auth"
import {
  LayoutDashboard,
  Building2,
  AlertTriangle,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  User,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Building2,
  },
  {
    title: "Alertes",
    href: "/alerts",
    icon: AlertTriangle,
  },
  {
    title: "Profil",
    href: "/profile",
    icon: User,
  },
  {
    title: "Utilisateurs",
    href: "/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "Administration",
    href: "/admin",
    icon: Settings,
    roles: ["ADMIN"],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { user } = useAuth()

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true
    return user && item.roles.includes(user.role)
  })

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          {!sidebarCollapsed && <span className="text-lg font-semibold text-sidebar-foreground">MSSP Health</span>}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                sidebarCollapsed && "justify-center",
              )}
              title={sidebarCollapsed ? item.title : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn("w-full", sidebarCollapsed && "justify-center px-0")}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!sidebarCollapsed && <span className="ml-2">Réduire</span>}
        </Button>
      </div>
    </aside>
  )
}
