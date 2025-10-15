"use client"

import { AlertTriangle, CheckCircle2, XCircle, AlertCircle, Shield } from "lucide-react"
import { mockClients } from "@/lib/mock-data"

interface AuditReportProps {
  clientId: string
  clientName: string
}

export function AuditReport({ clientId, clientName }: AuditReportProps) {
  const client = mockClients.find((c) => c.id === clientId)
  const displayName = client?.name || clientName

  // Mock audit data
  const auditData = {
    date: "13/01/2025 à 08:00",
    status: "WARNING",
    summary: {
      positive:
        "Aucun souci majeur au niveau de l'inventaire, bons taux de conformité et pas de menaces actives détectées.",
      attention:
        "Seuils de la politique de mise en jour et de scan ne sont pas respectés, bases antivirus serveur obsolètes.",
      actions:
        "Forcer paramètres politiques de scan et de mise à jour, vérifier disponibilité des dépôts de mises à jour, relancer manuellement les mises à jour des bases antivirus serveur.",
    },
    metrics: {
      totalMachines: client?.machineCount || 4850,
      activeThreats: 0,
      complianceRate: 97,
      nonComplianceRate: 12,
    },
    categories: [
      {
        id: "inventory",
        name: "Inventaire & Visibilité",
        icon: Shield,
        color: "blue",
        controls: [
          { id: "C1.1", name: "ID 10978 IA Contrôle de réseau", status: "OK", percentage: 100 },
          { id: "C1.2", name: "ID 6560 IA Machines de cellule", status: "OK", percentage: 90 },
          { id: "C1.3", name: "WARNING IA Contrôle de la base", status: "OK", percentage: 75 },
          { id: "C1.4", name: "ICC MIS RCI Routeur de via crystal", status: "OK", percentage: 70 },
        ],
      },
      {
        id: "compliance",
        name: "Ccoordination & Hardening",
        icon: AlertTriangle,
        color: "red",
        controls: [
          { id: "C2.1", name: "ID 10978 IA Contrôle de mise", status: "WARNING", percentage: 100 },
          { id: "C2.2", name: "ID 6560 IA Nombre de vérifier", status: "OK", percentage: 90 },
          { id: "C2.3", name: "WARNING IA Nombre de scanner", status: "OK", percentage: 95 },
          { id: "C2.4", name: "ICC MIS RCI Routeur de via crystal", status: "CRITICAL", percentage: 60 },
        ],
      },
      {
        id: "detection",
        name: "Détection & Réponse",
        icon: Shield,
        color: "green",
        controls: [
          { id: "C3.1", name: "ID 10978 IA Alerte de via réseau", status: "OK", percentage: 100 },
          { id: "C3.2", name: "ID 6560 IA Contrôle de via réseau", status: "OK", percentage: 90 },
          { id: "C3.3", name: "WARNING IA Contrôle de via serveur", status: "WARNING", percentage: 60 },
          { id: "C3.4", name: "CRITICAL Alerte de via réseau", status: "WARNING", percentage: 60 },
        ],
      },
      {
        id: "server",
        name: "Santé Serveur KSC",
        icon: Shield,
        color: "purple",
        controls: [
          { id: "C4.1", name: "ID 10978 IA Admission de via réseau", status: "OK", percentage: 95 },
          { id: "C4.2", name: "ID 6560 IA Espace de via Disque", status: "OK", percentage: 90 },
          { id: "C4.3", name: "WARNING IA Contrôle de via réseau", status: "WARNING", percentage: 80 },
          { id: "C4.4", name: "ICC MIS RCI Routeur de via crystal", status: "OK", percentage: 60 },
        ],
      },
    ],
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OK":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "WARNING":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "CRITICAL":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getCategoryColor = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-500/10 border-blue-500/20"
      case "red":
        return "bg-red-500/10 border-red-500/20"
      case "green":
        return "bg-green-500/10 border-green-500/20"
      case "purple":
        return "bg-purple-500/10 border-purple-500/20"
      default:
        return "bg-card"
    }
  }

  return <div>{/* Audit Report UI goes here */}</div>
}
