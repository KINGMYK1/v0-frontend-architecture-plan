"use client"

import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import type { Alert } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { AlertTriangle, AlertCircle, Info } from "lucide-react"

interface RecentAlertsProps {
  alerts: Alert[]
}

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return <AlertCircle className="h-4 w-4" />
      case "WARNING":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20"
      case "WARNING":
        return "bg-warning/10 text-warning hover:bg-warning/20"
      default:
        return "bg-primary/10 text-primary hover:bg-primary/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-destructive/10 text-destructive"
      case "ACKNOWLEDGED":
        return "bg-warning/10 text-warning"
      case "RESOLVED":
        return "bg-success/10 text-success"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
        >
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              getSeverityColor(alert.severity),
            )}
          >
            {getSeverityIcon(alert.severity)}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{alert.title}</p>
                <p className="text-sm text-muted-foreground">{alert.clientName}</p>
              </div>
              <Badge className={cn("shrink-0", getStatusColor(alert.status))}>{alert.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{alert.message}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true, locale: fr })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
