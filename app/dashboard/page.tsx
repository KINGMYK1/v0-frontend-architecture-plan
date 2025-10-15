"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusChart } from "@/components/dashboard/status-chart"
import { AlertsChart } from "@/components/dashboard/alerts-chart"
import { ClientsTable } from "@/components/dashboard/clients-table"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import {
  mockDashboardStats,
  mockClients,
  mockRecentAlerts,
  mockStatusDistribution,
  mockTopAlerts,
} from "@/lib/mock-data"
import { Building2, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const stats = mockDashboardStats

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Vue d'ensemble de la surveillance de sécurité</p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Clients" value={stats.totalClients} icon={Building2} />
          <StatCard
            title="Clients OK"
            value={stats.clientsOk}
            icon={CheckCircle2}
            className="border-success/20 bg-success/5"
          />
          <StatCard
            title="Avertissements"
            value={stats.clientsWarning}
            icon={AlertTriangle}
            className="border-warning/20 bg-warning/5"
          />
          <StatCard
            title="Critiques"
            value={stats.clientsCritical}
            icon={AlertCircle}
            className="border-destructive/20 bg-destructive/5"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Répartition des Statuts</h3>
            <StatusChart data={mockStatusDistribution} />
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Top 5 Alertes</h3>
            <AlertsChart data={mockTopAlerts} />
          </div>
        </div>

        {/* Clients Table */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-6">
            <h3 className="text-lg font-semibold">Clients Récents</h3>
            <p className="text-sm text-muted-foreground">Aperçu des derniers clients audités</p>
          </div>
          <ClientsTable clients={mockClients} />
        </div>

        {/* Recent Alerts */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Alertes Récentes</h3>
          <RecentAlerts alerts={mockRecentAlerts.slice(0, 5)} />
        </div>
      </div>
    </MainLayout>
  )
}
