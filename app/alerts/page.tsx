"use client"

import { useState, useMemo } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { StatCard } from "@/components/dashboard/stat-card"
import { AlertFilters } from "@/components/alerts/alert-filters"
import { AlertCard } from "@/components/alerts/alert-card"
import { mockAllAlerts } from "@/lib/mock-data"
import type { Alert, AlertSeverity, AlertStatus } from "@/lib/types"
import { AlertTriangle, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import toast from "react-hot-toast"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAllAlerts)
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "ALL">("ALL")
  const [statusFilter, setStatusFilter] = useState<AlertStatus | "ALL">("ALL")

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSeverity = severityFilter === "ALL" || alert.severity === severityFilter
      const matchesStatus = statusFilter === "ALL" || alert.status === statusFilter
      return matchesSearch && matchesSeverity && matchesStatus
    })
  }, [alerts, searchQuery, severityFilter, statusFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: alerts.length,
      active: alerts.filter((a) => a.status === "ACTIVE").length,
      critical: alerts.filter((a) => a.severity === "CRITICAL").length,
      acknowledged: alerts.filter((a) => a.status === "ACKNOWLEDGED").length,
    }
  }, [alerts])

  const handleAcknowledge = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "ACKNOWLEDGED" as AlertStatus,
              acknowledgedAt: new Date().toISOString(),
              acknowledgedBy: "Technicien SOC",
            }
          : alert,
      ),
    )
    toast.success("Alerte acquittée avec succès")
  }

  const handleResolve = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "RESOLVED" as AlertStatus,
              resolvedAt: new Date().toISOString(),
            }
          : alert,
      ),
    )
    toast.success("Alerte résolue avec succès")
  }

  const handleViewDetails = (alertId: string) => {
    const alert = alerts.find((a) => a.id === alertId)
    if (alert) {
      toast.success(`Affichage des détails de l'alerte "${alert.title}"`)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertes</h1>
          <p className="text-muted-foreground">Gestion et suivi des alertes de sécurité</p>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Alertes" value={stats.total} icon={AlertTriangle} />
          <StatCard
            title="Alertes Actives"
            value={stats.active}
            icon={AlertCircle}
            className="border-destructive/20 bg-destructive/5"
          />
          <StatCard
            title="Critiques"
            value={stats.critical}
            icon={AlertCircle}
            className="border-destructive/20 bg-destructive/5"
          />
          <StatCard
            title="Acquittées"
            value={stats.acknowledged}
            icon={Clock}
            className="border-warning/20 bg-warning/5"
          />
        </div>

        {/* Filters */}
        <AlertFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          severityFilter={severityFilter}
          onSeverityFilterChange={setSeverityFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredAlerts.length} alerte{filteredAlerts.length > 1 ? "s" : ""} trouvée
            {filteredAlerts.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
              <p className="mt-4 text-lg font-medium">Aucune alerte trouvée</p>
              <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres de recherche</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={handleAcknowledge}
                onResolve={handleResolve}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
