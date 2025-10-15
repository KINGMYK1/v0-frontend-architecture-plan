"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Client } from "@/lib/types"
import { ArrowLeft, Play, Settings } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface ClientHeaderProps {
  client: Client
  onRunAudit: () => void
}

export function ClientHeader({ client, onRunAudit }: ClientHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "OK":
        return "bg-success/10 text-success hover:bg-success/20"
      case "WARNING":
        return "bg-warning/10 text-warning hover:bg-warning/20"
      case "CRITICAL":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/clients">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux clients
        </Link>
      </Button>

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
            <Badge className={cn("font-medium", getStatusColor(client.status))}>{client.status}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{client.kscUrl}</span>
            <span>•</span>
            <span>{client.machineCount} machines</span>
            <span>•</span>
            <span>
              Dernier audit:{" "}
              {client.lastAuditDate
                ? formatDistanceToNow(new Date(client.lastAuditDate), { addSuffix: true, locale: fr })
                : "Jamais"}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Configurer
          </Button>
          <Button size="sm" onClick={onRunAudit}>
            <Play className="mr-2 h-4 w-4" />
            Lancer un audit
          </Button>
        </div>
      </div>
    </div>
  )
}
