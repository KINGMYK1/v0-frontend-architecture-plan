"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import type { Client } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Play, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface ClientsListProps {
  clients: Client[]
  onEdit: (client: Client) => void
  onDelete: (clientId: string) => void
  onRunAudit: (clientId: string) => void
}

export function ClientsList({ clients, onEdit, onDelete, onRunAudit }: ClientsListProps) {
  const router = useRouter()

  const handleRunAudit = (e: React.MouseEvent, clientId: string, clientName: string) => {
    e.preventDefault()
    e.stopPropagation()
    toast.success(`Audit lancé pour "${clientName}"`, {
      duration: 2000,
    })
    // Navigate to audit page after a short delay
    setTimeout(() => {
      router.push(`/clients/${clientId}/audit`)
    }, 500)
  }

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

  if (clients.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">Aucun client trouvé</p>
          <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres de recherche</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Client</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Statut</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Machines</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Alertes</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Dernier audit</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Dernière connexion</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-card">
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
                  <span className="text-sm text-muted-foreground">0</span>
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
                <p className="text-sm">
                  {client.lastConnectionDate
                    ? formatDistanceToNow(new Date(client.lastConnectionDate), { addSuffix: true, locale: fr })
                    : "Jamais"}
                </p>
              </td>
              <td className="px-4 py-4">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="sm" asChild title="Voir les détails">
                    <Link href={`/clients/${client.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleRunAudit(e, client.id, client.name)}
                    title="Lancer un audit"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(client)} title="Modifier">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(client.id)}
                    className="text-destructive hover:text-destructive"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
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
