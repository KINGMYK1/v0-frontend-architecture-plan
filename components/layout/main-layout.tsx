"use client"

import type React from "react"

import { useRequireAuth } from "@/lib/hooks/use-require-auth"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useUIStore } from "@/lib/stores/ui-store"
import { cn } from "@/lib/utils"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated } = useRequireAuth()
  const { sidebarCollapsed } = useUIStore()

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className={cn("flex flex-1 flex-col transition-all duration-300", sidebarCollapsed ? "ml-16" : "ml-64")}>
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">{children}</main>
      </div>
    </div>
  )
}
