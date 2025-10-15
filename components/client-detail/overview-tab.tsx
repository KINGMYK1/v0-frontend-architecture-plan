"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, AlertCircle, TrendingUp } from "lucide-react"

export function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Résumé Exécutif</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <div>
              <p className="font-medium text-success">Points Positifs</p>
              <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                <li>• Protection temps réel active sur 98% des machines</li>
                <li>• Bases antivirus à jour sur tous les serveurs</li>
                <li>• Taux de conformité des politiques: 95%</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div>
              <p className="font-medium text-warning">Points d'Attention</p>
              <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                <li>• 8 machines non connectées depuis plus de 7 jours</li>
                <li>• 3 machines avec bases antivirus obsolètes</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Actions Requises</p>
              <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                <li>• Aucune action critique requise</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taux de Conformité</p>
              <p className="mt-2 text-3xl font-bold">95%</p>
              <p className="mt-1 flex items-center text-sm text-success">
                <TrendingUp className="mr-1 h-3 w-3" />
                +2% vs mois dernier
              </p>
            </div>
            <div className="h-16 w-16 rounded-full border-4 border-success/20 bg-success/10" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Machines Protégées</p>
              <p className="mt-2 text-3xl font-bold">147/150</p>
              <p className="mt-1 text-sm text-muted-foreground">98% du parc</p>
            </div>
            <div className="h-16 w-16 rounded-full border-4 border-primary/20 bg-primary/10" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alertes Actives</p>
              <p className="mt-2 text-3xl font-bold">0</p>
              <p className="mt-1 text-sm text-success">Aucune alerte critique</p>
            </div>
            <div className="h-16 w-16 rounded-full border-4 border-success/20 bg-success/10" />
          </div>
        </Card>
      </div>
    </div>
  )
}
