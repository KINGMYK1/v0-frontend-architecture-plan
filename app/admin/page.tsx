"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Shield, Mail, Clock, Lock, Database, Bell, Activity, Trash2 } from "lucide-react"
import { useState } from "react"

export default function AdminPage() {
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [autoAuditEnabled, setAutoAuditEnabled] = useState(true)
  const [criticalAlertsEnabled, setCriticalAlertsEnabled] = useState(true)

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configuration Globale</h1>
            <p className="text-muted-foreground">Paramètres système et configuration</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Email Configuration */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Configuration Email (SMTP)</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">Serveur SMTP</Label>
                <Input id="smtp-host" defaultValue="smtp.example.com" className="bg-background" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Port</Label>
                  <Input id="smtp-port" defaultValue="587" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">Utilisateur</Label>
                  <Input id="smtp-user" defaultValue="noreply@mssp.com" className="bg-background" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-password">Mot de passe</Label>
                <Input id="smtp-password" type="password" defaultValue="••••••••" className="bg-background" />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Activer les notifications email</span>
                </div>
                <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
              </div>
            </div>
          </Card>

          {/* System Status */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              <h2 className="text-lg font-semibold">État du système</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">API Backend</span>
                </div>
                <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-500">
                  Opérationnel
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Base de données</span>
                </div>
                <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-500">
                  Connecté
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Service Email</span>
                </div>
                <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-500">
                  Actif
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="text-sm">Cache Redis</span>
                </div>
                <Badge variant="outline" className="border-orange-500/50 bg-orange-500/10 text-orange-500">
                  Dégradé
                </Badge>
              </div>
            </div>
          </Card>

          {/* Audit & Thresholds */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-semibold">Audits & Seuils par défaut</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div>
                  <p className="text-sm font-medium">Audits automatiques quotidiens</p>
                  <p className="text-xs text-muted-foreground">Exécuter les audits chaque jour à 02:00</p>
                </div>
                <Switch checked={autoAuditEnabled} onCheckedChange={setAutoAuditEnabled} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold-disconnected">Machines déconnectées (jours)</Label>
                <Input id="threshold-disconnected" type="number" defaultValue="30" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold-av">Bases AV obsolètes (heures)</Label>
                <Input id="threshold-av" type="number" defaultValue="48" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold-cpu">Seuil CPU critique (%)</Label>
                <Input id="threshold-cpu" type="number" defaultValue="90" className="bg-background" />
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold">Sécurité</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Délai d'expiration session (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="60" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-policy">Politique de mot de passe</Label>
                <Input
                  id="password-policy"
                  defaultValue="Min 8 caractères, 1 maj, 1 min, 1 chiffre"
                  className="bg-background"
                  disabled
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div>
                  <p className="text-sm font-medium">Authentification à deux facteurs</p>
                  <p className="text-xs text-muted-foreground">Requis pour les administrateurs</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div>
                  <p className="text-sm font-medium">Alertes critiques immédiates</p>
                  <p className="text-xs text-muted-foreground">Email instantané pour alertes critiques</p>
                </div>
                <Switch checked={criticalAlertsEnabled} onCheckedChange={setCriticalAlertsEnabled} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div>
                  <p className="text-sm font-medium">Résumé quotidien</p>
                  <p className="text-xs text-muted-foreground">Rapport journalier à 08:00</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div>
                  <p className="text-sm font-medium">Notifications Slack/Teams</p>
                  <p className="text-xs text-muted-foreground">Intégration webhook</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          {/* Database Management */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-cyan-500" />
              <h2 className="text-lg font-semibold">Gestion de la base de données</h2>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Rétention des audits</span>
                  <Badge variant="outline">90 jours</Badge>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Rétention des alertes</span>
                  <Badge variant="outline">90 jours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rétention des logs</span>
                  <Badge variant="outline">365 jours</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent" size="sm">
                <Database className="mr-2 h-4 w-4" />
                Sauvegarder la base de données
              </Button>
              <Button
                variant="outline"
                className="w-full text-red-500 hover:bg-red-500/10 hover:text-red-500 bg-transparent"
                size="sm"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Nettoyer les données anciennes
              </Button>
            </div>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Réinitialiser</Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
