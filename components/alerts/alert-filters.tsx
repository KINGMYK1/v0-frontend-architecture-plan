"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { AlertSeverity, AlertStatus } from "@/lib/types"

interface AlertFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  severityFilter: AlertSeverity | "ALL"
  onSeverityFilterChange: (severity: AlertSeverity | "ALL") => void
  statusFilter: AlertStatus | "ALL"
  onStatusFilterChange: (status: AlertStatus | "ALL") => void
}

export function AlertFilters({
  searchQuery,
  onSearchChange,
  severityFilter,
  onSeverityFilterChange,
  statusFilter,
  onStatusFilterChange,
}: AlertFiltersProps) {
  const severityOptions: Array<{ value: AlertSeverity | "ALL"; label: string }> = [
    { value: "ALL", label: "Toutes" },
    { value: "CRITICAL", label: "Critiques" },
    { value: "WARNING", label: "Warnings" },
    { value: "INFO", label: "Info" },
  ]

  const statusOptions: Array<{ value: AlertStatus | "ALL"; label: string }> = [
    { value: "ALL", label: "Tous" },
    { value: "ACTIVE", label: "Actives" },
    { value: "ACKNOWLEDGED", label: "Acquittées" },
    { value: "RESOLVED", label: "Résolues" },
  ]

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher une alerte ou un client..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-secondary/50 pl-9"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Sévérité</p>
          <div className="flex gap-2">
            {severityOptions.map((option) => (
              <Button
                key={option.value}
                variant={severityFilter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => onSeverityFilterChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Statut</p>
          <div className="flex gap-2">
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={statusFilter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusFilterChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
