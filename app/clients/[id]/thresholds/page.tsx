"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RotateCcw, AlertTriangle, CheckCircle2, XCircle, Settings } from "lucide-react"
import Link from "next/link"

interface ThresholdControl {
  id: string
  name: string
  type: "days" | "percentage" | "count"
  warningValue: number
  criticalValue: number
  unit: string
}

const thresholdCategories = {
  inventory: {
    title: "Inventaire & Visibilité",
    icon: "📊",
    color: "primary",
    controls: [
      {
        id: "disconnected",
        name: "Machines non connectées (jours)",
        type: "days" as const,
        warningValue: 7,
        criticalValue: 30,
        unit: "jours",
      },
      {
        id: "agent_version",
        name: "Conformité version agent (%)",
        type: "percentage" as const,
        warningValue: 90,
        criticalValue: 80,
        unit: "%",
      },
    ],
  },
  compliance: {
    title: "Conformité & Hardening",
    icon: "🛡️",
    color: "success",
    controls: [
      {
        id: "policy_compliance",
        name: "Conformité version agent (%)",
        type: "percentage" as const,
        warningValue: 90,
        criticalValue: 80,
        unit: "%",
      },
      {
        id: "update_tasks",
        name: "Tâches de mise à jour (jours)",
        type: "days" as const,
        warningValue: 7,
        criticalValue: 14,
        unit: "jours",
      },
    ],
  },
  detection: {
    title: "Détection & Réponse",
    icon: "🔍",
    color: "destructive",
    controls: [
      {
        id: "active_threats",
        name: "Menaces actives (nombre)",
        type: "count" as const,
        warningValue: 1,
        criticalValue: 5,
        unit: "menaces",
      },
      {
        id: "infected_machines",
        name: "Machines infectées",
        type: "count" as const,
        warningValue: 1,
        criticalValue: 10,
        unit: "machines",
      },
      {
        id: "critical_vulns",
        name: "Vulnérabilités critiques",
        type: "count" as const,
        warningValue: 10,
        criticalValue: 50,
        unit: "vulnérabilités",
      },
    ],
  },
  server: {
    title: "Santé Serveur KSC",
    icon: "⚙️",
    color: "accent",
    controls: [
      {
        id: "cpu_usage",
        name: "Utilisation CPU (%)",
        type: "percentage" as const,
        warningValue: 80,
        criticalValue: 95,
        unit: "%",
      },
      {
        id: "ram_usage",
        name: "Utilisation RAM (%)",
        type: "percentage" as const,
        warningValue: 80,
        criticalValue: 95,
        unit: "%",
      },
      {
        id: "disk_space",
        name: "Utilisation Disque (%)",
        type: "percentage" as const,
        warningValue: 70,
        criticalValue: 90,
        unit: "%",
      },
      {
        id: "license_expiry",
        name: "Expiration licence (jours)",
        type: "days" as const,
        warningValue: 60,
        criticalValue: 30,
        unit: "jours",
      },
    ],
  },
}

export default function ClientThresholdsPage() {
  const params = useParams()
  const router = useRouter()
  const [customEnabled, setCustomEnabled] = useState(true)
  const [thresholds, setThresholds] = useState(thresholdCategories)

  const handleReset = () => {
    setThresholds(thresholdCategories)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/clients/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au client
            </Link>
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">ABC Corporation - Seuils Personnalisés</h1>
              <p className="text-muted-foreground">https://ksc.abc.com</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
              <Button variant="outline">Annuler</Button>
              <Button className="bg-gradient-to-r from-primary to-secondary">
                <Settings className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Threshold Configuration */}
          <div className="lg:col-span-2 space-y-4">
            {/* Custom Thresholds Toggle */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Seuils personnalisés</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Les seuils par défaut de la configuration globale seront utilisés.
                  </p>
                  <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded mt-2">
                    Les seuils par défaut de la configuration globale seront utilisés pour ce client.
                  </p>
                </div>
                <Switch checked={customEnabled} onCheckedChange={setCustomEnabled} />
              </div>
            </Card>

            {/* Threshold Categories */}
            {Object.entries(thresholds).map(([key, category]) => (
              <Card key={key} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="font-semibold">{category.title}</h3>
                  </div>

                  <div className="space-y-6">
                    {category.controls.map((control) => (
                      <div key={control.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{control.name}</Label>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-warning" />
                              <span className="text-sm font-medium">Avertissement</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-destructive" />
                              <span className="text-sm font-medium">Critique</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={control.warningValue}
                                className="w-24"
                                disabled={!customEnabled}
                              />
                              <span className="text-sm text-muted-foreground">{control.unit}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={control.criticalValue}
                                className="w-24"
                                disabled={!customEnabled}
                              />
                              <span className="text-sm text-muted-foreground">{control.unit}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Right Column - Preview & Info */}
          <div className="space-y-4">
            {/* Alert Preview */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Aperçu des Alertes</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">OK</span>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    3 contrôles
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Avertissement</span>
                  </div>
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                    0 contrôle
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">Critique</span>
                  </div>
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                    0 contrôle
                  </Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                Appliquer
              </Button>
            </Card>

            {/* Comparison */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Comparaison</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Machines déco.</span>
                  <span className="font-medium">7 / 30j</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conformité</span>
                  <span className="font-medium">95% / 90j</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vulnérabilités</span>
                  <span className="font-medium">10 / 50</span>
                </div>
              </div>
            </Card>

            {/* Important Notice */}
            <Card className="p-4 bg-warning/5 border-warning/20">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Important</h3>
                  <p className="text-xs text-muted-foreground">
                    Le seuil par défaut «non-conformité» globale permet d'avoir un aperçu des menaces critiques
                    détectées sur l'ensemble des clients.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    En personnalisant les seuils pour ce client, vous pourrez affiner les alertes selon les besoins
                    spécifiques de cette organisation.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
