"use client"

import { MainLayout } from "@/components/layout/main-layout"

export default function AdminPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
          <p className="text-muted-foreground">Gestion des utilisateurs et configuration</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="h-96 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </MainLayout>
  )
}
