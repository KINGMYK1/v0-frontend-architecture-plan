"use client"

import { useState, useMemo } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { StatCard } from "@/components/dashboard/stat-card"
import { ClientFilters } from "@/components/clients/client-filters"
import { ClientsList } from "@/components/clients/clients-list"
import { ClientModal } from "@/components/clients/client-modal"
import { mockAllClients } from "@/lib/mock-data"
import type { Client, AuditStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Plus, Building2, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

export default function ClientsPage() {
  const [clients] = useState<Client[]>(mockAllClients)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<AuditStatus | "ALL">("ALL")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined)

  // Filter clients based on search and status
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.kscUrl.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "ALL" || client.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [clients, searchQuery, statusFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: clients.length,
      ok: clients.filter((c) => c.status === "OK").length,
      warning: clients.filter((c) => c.status === "WARNING").length,
      critical: clients.filter((c) => c.status === "CRITICAL").length,
    }
  }, [clients])

  const handleAddClient = () => {
    setSelectedClient(undefined)
    setIsModalOpen(true)
  }

  const handleEditClient = (client: Client) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  const handleDeleteClient = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId)
    if (client) {
      toast.success(`Client "${client.name}" supprimé avec succès`)
    }
  }

  const handleRunAudit = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId)
    if (client) {
      toast.success(`Audit lancé pour "${client.name}"`)
    }
  }

  const handleSaveClient = async (data: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (selectedClient) {
      toast.success(`Client "${data.name}" modifié avec succès`)
    } else {
      toast.success(`Client "${data.name}" ajouté avec succès`)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
            <p className="text-muted-foreground">Gestion des clients et surveillance KSC</p>
          </div>
          <Button onClick={handleAddClient}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un client
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Clients" value={stats.total} icon={Building2} />
          <StatCard
            title="Clients OK"
            value={stats.ok}
            icon={CheckCircle2}
            className="border-success/20 bg-success/5"
          />
          <StatCard
            title="Avertissements"
            value={stats.warning}
            icon={AlertTriangle}
            className="border-warning/20 bg-warning/5"
          />
          <StatCard
            title="Critiques"
            value={stats.critical}
            icon={AlertCircle}
            className="border-destructive/20 bg-destructive/5"
          />
        </div>

        {/* Filters */}
        <ClientFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Clients List */}
        <ClientsList
          clients={filteredClients}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
          onRunAudit={handleRunAudit}
        />

        {/* Add/Edit Modal */}
        <ClientModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          client={selectedClient}
          onSave={handleSaveClient}
        />
      </div>
    </MainLayout>
  )
}
