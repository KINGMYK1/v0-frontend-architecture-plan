"use client"

import { useParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { AuditReport } from "@/components/reports/audit-report"
import { mockClients } from "@/lib/mock-data"

export default function ClientAuditPage() {
  const params = useParams()
  const client = mockClients.find((c) => c.id === params.id)

  if (!client) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Client non trouvé</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <AuditReport clientId={client.id} clientName={client.name} />
    </MainLayout>
  )
}
