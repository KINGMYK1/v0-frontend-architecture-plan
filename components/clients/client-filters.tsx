"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { AuditStatus } from "@/lib/types"

interface ClientFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: AuditStatus | "ALL"
  onStatusFilterChange: (status: AuditStatus | "ALL") => void
}

export function ClientFilters({ searchQuery, onSearchChange, statusFilter, onStatusFilterChange }: ClientFiltersProps) {
  const statusOptions: Array<{ value: AuditStatus | "ALL"; label: string }> = [
    { value: "ALL", label: "Tous" },
    { value: "OK", label: "OK" },
    { value: "WARNING", label: "Warning" },
    { value: "CRITICAL", label: "Critical" },
  ]

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative flex-1 sm:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher un client..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-secondary/50 pl-9"
        />
      </div>

      {/* Status Filters */}
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
  )
}
