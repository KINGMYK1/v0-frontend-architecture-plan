"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ClientHeader } from "@/components/client-detail/client-header"
import { OverviewTab } from "@/components/client-detail/overview-tab"
import { ControlsTab } from "@/components/client-detail/controls-tab"
import { HistoryTab } from "@/components/client-detail/history-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockAllClients } from "@/lib/mock-data"
import { useParams } from "next/navigation"
import toast from "react-hot-toast"

const inventoryControls = [
  {
    id: "C1.1",
    name: "Machines non connectées",
    status: "WARNING" as const,
    value: "8 machines",
    message: "8 machines non connectées depuis plus de 7 jours",
  },
  {
    id: "C1.2",
    name: "Conformité versions agents",
    status: "OK" as const,
    value: "100%",
    message: "Tous les agents sont à jour",
  },
  {
    id: "C1.3",
    name: "Statut module EDR",
    status: "OK" as const,
    value: "Actif",
    message: "Module EDR actif sur toutes les machines",
  },
  {
    id: "C1.4",
    name: "État agents d'administration",
    status: "OK" as const,
    value: "Opérationnel",
    message: "Tous les agents d'administration fonctionnent correctement",
  },
  {
    id: "C1.5",
    name: "Statistiques globales",
    status: "OK" as const,
    value: "150 machines",
    message: "Inventaire complet et à jour",
  },
]

const complianceControls = [
  {
    id: "C2.1",
    name: "Politiques de sécurité actives",
    status: "OK" as const,
    value: "12/12",
    message: "Toutes les politiques sont actives",
  },
  {
    id: "C2.2",
    name: "Tâches de scan",
    status: "OK" as const,
    value: "98%",
    message: "Taux de succès des scans supérieur au seuil",
  },
  {
    id: "C2.3",
    name: "Tâches de mise à jour",
    status: "OK" as const,
    value: "97%",
    message: "Taux de succès des mises à jour conforme",
  },
  {
    id: "C2.4",
    name: "Fraîcheur bases antivirus serveur",
    status: "OK" as const,
    value: "< 12h",
    message: "Bases antivirus serveur à jour",
  },
  {
    id: "C2.5",
    name: "Fraîcheur bases machines",
    status: "WARNING" as const,
    value: "95%",
    message: "3 machines avec bases datant de plus de 7 jours",
  },
]

const detectionControls = [
  {
    id: "C3.1",
    name: "Menaces actives non résolues",
    status: "OK" as const,
    value: "0",
    message: "Aucune menace active détectée",
  },
  {
    id: "C3.2",
    name: "Machines infectées",
    status: "OK" as const,
    value: "0",
    message: "Aucune machine infectée",
  },
  {
    id: "C3.3",
    name: "Protection temps réel désactivée",
    status: "OK" as const,
    value: "0",
    message: "Protection active sur toutes les machines",
  },
  {
    id: "C3.4",
    name: "Erreurs critiques système",
    status: "OK" as const,
    value: "0",
    message: "Aucune erreur critique détectée",
  },
  {
    id: "C3.5",
    name: "Objets en quarantaine",
    status: "OK" as const,
    value: "5",
    message: "5 objets en quarantaine (normal)",
  },
  {
    id: "C3.6",
    name: "Vulnérabilités critiques",
    status: "OK" as const,
    value: "0",
    message: "Aucune vulnérabilité critique non corrigée",
  },
]

const serverHealthControls = [
  {
    id: "C4.1",
    name: "État du service KSC",
    status: "OK" as const,
    value: "Opérationnel",
    message: "Service KSC en ligne depuis 45 jours",
  },
  {
    id: "C4.2",
    name: "Performance serveur",
    status: "OK" as const,
    value: "Normal",
    message: "CPU: 45%, RAM: 62%, Disque: 120 Go disponibles",
  },
  {
    id: "C4.3",
    name: "Validité licence",
    status: "OK" as const,
    value: "180 jours",
    message: "Licence valide jusqu'au 15/07/2025",
  },
  {
    id: "C4.4",
    name: "Certificats et sauvegardes",
    status: "OK" as const,
    value: "Valides",
    message: "Certificats valides, dernière sauvegarde: il y a 1 jour",
  },
]

export default function ClientDetailPage() {
  const params = useParams()
  const clientId = params.id as string
  const client = mockAllClients.find((c) => c.id === clientId)

  const [activeTab, setActiveTab] = useState("overview")

  if (!client) {
    return (
      <MainLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Client non trouvé</h2>
            <p className="mt-2 text-muted-foreground">Le client demandé n'existe pas</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const handleRunAudit = () => {
    toast.success(`Audit lancé pour "${client.name}"`)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <ClientHeader client={client} onRunAudit={handleRunAudit} />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="inventory">Inventaire</TabsTrigger>
            <TabsTrigger value="compliance">Conformité</TabsTrigger>
            <TabsTrigger value="detection">Détection</TabsTrigger>
            <TabsTrigger value="server">Santé KSC</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="inventory" className="mt-6">
            <ControlsTab title="Inventaire & Visibilité" controls={inventoryControls} />
          </TabsContent>

          <TabsContent value="compliance" className="mt-6">
            <ControlsTab title="Conformité & Hardening" controls={complianceControls} />
          </TabsContent>

          <TabsContent value="detection" className="mt-6">
            <ControlsTab title="Détection & Réponse" controls={detectionControls} />
          </TabsContent>

          <TabsContent value="server" className="mt-6">
            <ControlsTab title="Santé Serveur KSC" controls={serverHealthControls} />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <HistoryTab />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
