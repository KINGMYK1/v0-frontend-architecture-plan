"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Camera, Settings, Bell, LogOut, Shield } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useState } from "react"

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("informations")

  const tabs = [
    { id: "informations", label: "Informations" },
    { id: "security", label: "Sécurité" },
    { id: "notifications", label: "Notifications" },
    { id: "activity", label: "Activité" },
  ]

  return (
    <MainLayout>
      <div className="relative min-h-screen">
        {/* Decorative gradient circle */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-gradient-to-tr from-purple-500/20 to-transparent blur-3xl" />

        <div className="relative space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">MSSP Health Check</h1>
              <p className="text-sm text-muted-foreground">Mon Profil</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            {/* Left Sidebar */}
            <div className="space-y-6">
              {/* Avatar Card */}
              <Card className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="group relative">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-4xl font-bold text-white">
                      {user?.email.substring(0, 2).toUpperCase()}
                    </div>
                    <button className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600">
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold">John Doe</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <Badge className="mt-2 bg-gradient-to-r from-blue-500 to-purple-600">
                      {user?.role === "ADMIN"
                        ? "Administrateur"
                        : user?.role === "TECHNICIAN"
                          ? "Technicien SOC"
                          : "Manager"}
                    </Badge>
                  </div>
                  <div className="w-full space-y-1 border-t border-border pt-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Membre depuis</span>
                      <span className="font-medium">15 juin 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Dernière connexion</span>
                      <span className="font-medium">Il y a quelques minutes</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="mb-4 font-semibold">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent">
                    <Settings className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">Paramètres du compte</span>
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent">
                    <Bell className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">Gérer les notifications</span>
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent">
                    <LogOut className="h-5 w-5 text-red-500" />
                    <span className="text-sm">Se déconnecter</span>
                  </button>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <Card className="p-6">
              {/* Tabs */}
              <div className="mb-6 flex gap-2 border-b border-border">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "informations" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Informations Personales</h2>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" defaultValue="John" className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" defaultValue="Doe" className="bg-background" />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user?.email} className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" defaultValue="+12 600 123 456" className="bg-background" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Input id="timezone" defaultValue="Africa/Casablanca (GMT-1)" className="bg-background" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Langue</Label>
                    <Input id="language" defaultValue="Français" className="bg-background" />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline">Annuler</Button>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      Enregistrer
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Sécurité</h2>
                  <p className="text-sm text-muted-foreground">
                    Gérez vos paramètres de sécurité et de confidentialité
                  </p>
                  <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
                    <p className="text-muted-foreground">Paramètres de sécurité à venir</p>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Notifications</h2>
                  <p className="text-sm text-muted-foreground">Configurez vos préférences de notification</p>
                  <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
                    <p className="text-muted-foreground">Paramètres de notification à venir</p>
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Activité</h2>
                  <p className="text-sm text-muted-foreground">Consultez votre historique d'activité</p>
                  <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
                    <p className="text-muted-foreground">Historique d'activité à venir</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
