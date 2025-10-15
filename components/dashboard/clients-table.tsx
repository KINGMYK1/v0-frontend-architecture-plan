"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import type { Client } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface ClientsTableProps {
  clients: Client[]
}

export function ClientsTable({ clients }: ClientsTableProps) {
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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Client</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Statut</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Machines</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Alertes</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Dernier audit</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-border last:border-0 hover:bg-muted/50">
              <td className="px-4 py-4">
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-muted-foreground">{client.kscUrl}</p>
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge className={cn("font-medium", getStatusColor(client.status))}>{client.status}</Badge>
              </td>
              <td className="px-4 py-4">
                <p className="font-medium">{client.machineCount}</p>
              </td>
              <td className="px-4 py-4">
                {client.activeAlerts && client.activeAlerts > 0 ? (
                  <Badge variant="destructive">{client.activeAlerts}</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">Aucune</span>
                )}
              </td>
              <td className="px-4 py-4">
                <p className="text-sm">
                  {client.lastAuditDate
                    ? formatDistanceToNow(new Date(client.lastAuditDate), { addSuffix: true, locale: fr })
                    : "Jamais"}
                </p>
              </td>
              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/clients/${client.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
