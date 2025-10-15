"use client"

import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import type { Alert } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AlertTriangle, AlertCircle, Info, Check, Eye } from "lucide-react"

interface AlertCardProps {
  alert: Alert
  onAcknowledge: (alertId: string) => void
  onResolve: (alertId: string) => void
  onViewDetails: (alertId: string) => void
}

export function AlertCard({ alert, onAcknowledge, onResolve, onViewDetails }: AlertCardProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return <AlertCircle className="h-5 w-5" />
      case "WARNING":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "WARNING":
        return "bg-warning/10 text-warning border-warning/20"
      default:
        return "bg-primary/10 text-primary border-primary/20"
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
    <div
      className={cn("rounded-lg border-2 bg-card p-6 transition-all hover:shadow-md", getSeverityColor(alert.severity))}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
            getSeverityColor(alert.severity),
          )}
        >
          {getSeverityIcon(alert.severity)}
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{alert.title}</h3>
                <Badge className={cn("shrink-0", getStatusColor(alert.status))}>{alert.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{alert.clientName}</p>
            </div>
            <Badge variant="outline" className="shrink-0">
              {alert.severity}
            </Badge>
          </div>

          <p className="text-sm">{alert.message}</p>

          <div className="flex items-center justify-between">
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Créée {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true, locale: fr })}</p>
              {alert.acknowledgedAt && (
                <p>
                  Acquittée par {alert.acknowledgedBy}{" "}
                  {formatDistanceToNow(new Date(alert.acknowledgedAt), { addSuffix: true, locale: fr })}
                </p>
              )}
              {alert.resolvedAt && (
                <p>Résolue {formatDistanceToNow(new Date(alert.resolvedAt), { addSuffix: true, locale: fr })}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onViewDetails(alert.id)}>
                <Eye className="mr-2 h-4 w-4" />
                Détails
              </Button>
              {alert.status === "ACTIVE" && (
                <Button variant="outline" size="sm" onClick={() => onAcknowledge(alert.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Acquitter
                </Button>
              )}
              {alert.status === "ACKNOWLEDGED" && (
                <Button variant="default" size="sm" onClick={() => onResolve(alert.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Résoudre
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
