"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, AlertCircle, TrendingUp } from "lucide-react"

export function OverviewTab() {
  return (
    <div className="space-y-6">
      <Card className="border-warning/30 bg-warning/5 p-6">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h3 className="text-lg font-semibold">État Global: Avertissement</h3>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">Dernier audit: 13/01/2025 à 09:00</p>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Points Positifs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <h4 className="font-semibold text-success">Points positifs</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-success">•</span>
                <span>Protection temps réel active sur 98% des machines</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">•</span>
                <span>Bases antivirus à jour sur tous les serveurs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">•</span>
                <span>Taux de conformité des politiques: 95%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">•</span>
                <span>Aucune menace active détectée</span>
              </li>
            </ul>
          </div>

          {/* Points d'Attention */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h4 className="font-semibold text-warning">Points d'attention</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-warning">•</span>
                <span>8 machines non connectées depuis plus de 7 jours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning">•</span>
                <span>3 machines avec bases antivirus obsolètes (&gt;7j)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning">•</span>
                <span>Taux de succès des scans: 92% (seuil: 95%)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning">•</span>
                <span>2 politiques de sécurité non appliquées</span>
              </li>
            </ul>
          </div>

          {/* Actions Requises */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <h4 className="font-semibold text-destructive">Actions requises</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Forcer reconnexion des 8 machines déconnectées</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Vérifier connectivité réseau des machines avec bases obsolètes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Analyser échecs de scan et relancer manuellement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Appliquer politiques manquantes sur groupes dysfonctionnels</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-primary/30 bg-primary/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Conformité Globale</p>
              <p className="mt-2 text-3xl font-bold">4850</p>
              <p className="mt-1 text-xs text-muted-foreground">Machines</p>
            </div>
          </div>
        </Card>

        <Card className="border-success/30 bg-success/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Machines ZEN</p>
              <p className="mt-2 text-3xl font-bold">4800</p>
              <p className="mt-1 text-xs text-muted-foreground">(ZEN)</p>
            </div>
          </div>
        </Card>

        <Card className="border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Menaces Actives</p>
              <p className="mt-2 text-3xl font-bold">0</p>
              <p className="mt-1 text-xs text-success">Aucune menace</p>
            </div>
          </div>
        </Card>

        <Card className="border-primary/30 bg-primary/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taux de conformité</p>
              <p className="mt-2 text-3xl font-bold">97%</p>
              <p className="mt-1 flex items-center text-xs text-success">
                <TrendingUp className="mr-1 h-3 w-3" />
                +2% vs mois dernier
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
