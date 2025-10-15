"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, Shield, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserModal } from "@/components/users/user-modal"
import { toast } from "@/lib/utils/toast"

interface User {
  id: string
  initials: string
  name: string
  email: string
  role: "ADMIN" | "TECHNICIEN_SOC" | "MANAGER"
  status: "ACTIVE" | "INACTIVE"
  lastConnection: string
  actions: number
  color: string
}

const mockUsers: User[] = [
  {
    id: "1",
    initials: "JD",
    name: "John Doe",
    email: "john.doe@mssp.com",
    role: "ADMIN",
    status: "ACTIVE",
    lastConnection: "Il y a 2h",
    actions: 245,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "2",
    initials: "JS",
    name: "Jane Smith",
    email: "jane.smith@mssp.com",
    role: "TECHNICIEN_SOC",
    status: "ACTIVE",
    lastConnection: "Il y a 1 j",
    actions: 189,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "3",
    initials: "SW",
    name: "Sam Wilson",
    email: "sam.wilson@mssp.com",
    role: "TECHNICIEN_SOC",
    status: "ACTIVE",
    lastConnection: "Il y a 3h",
    actions: 312,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "4",
    initials: "RB",
    name: "Robert Brown",
    email: "robert.brown@mssp.com",
    role: "MANAGER",
    status: "INACTIVE",
    lastConnection: "Il y a 15j",
    actions: 87,
    color: "from-orange-500 to-red-500",
  },
]

const roleLabels = {
  ADMIN: "Administrateur",
  TECHNICIEN_SOC: "Technicien SOC",
  MANAGER: "Manager",
}

const roleColors = {
  ADMIN: "bg-destructive/10 text-destructive",
  TECHNICIEN_SOC: "bg-primary/10 text-primary",
  MANAGER: "bg-accent/10 text-accent",
}

const permissions = {
  ADMIN: ["Accès complet au système", "Gestion des utilisateurs", "Configuration globale", "Tous les droits"],
  TECHNICIEN_SOC: ["Lecture des données", "Lancer des audits", "Acquitter les alertes", "Exporter les rapports"],
  MANAGER: ["Lecture seule", "Consulter les rapports", "Exporter les données"],
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const activeUsers = mockUsers.filter((u) => u.status === "ACTIVE").length
  const activePercentage = Math.round((activeUsers / mockUsers.length) * 100)

  const handleSaveUser = async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success(editingUser ? "Utilisateur mis à jour avec succès" : "Utilisateur créé avec succès")
    setEditingUser(null)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setUserModalOpen(true)
  }

  const handleDeleteUser = () => {
    toast.success("Utilisateur supprimé avec succès")
    setDeleteUser(null)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">MSSP Health Check</h1>
            <p className="text-muted-foreground">Gestion des Utilisateurs</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4 border-primary/20">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Utilisateurs</p>
              <p className="text-3xl font-bold">{mockUsers.length}</p>
            </div>
          </Card>
          <Card className="p-4 border-success/20">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Actifs</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold">{activeUsers}</p>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  {activePercentage}%
                </Badge>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-muted">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Inactifs</p>
              <p className="text-3xl font-bold">{mockUsers.length - activeUsers}</p>
            </div>
          </Card>
          <Card className="p-4 border-destructive/20">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Administrateurs</p>
              <p className="text-3xl font-bold">{mockUsers.filter((u) => u.role === "ADMIN").length}</p>
            </div>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            className="bg-gradient-to-r from-primary to-secondary"
            onClick={() => {
              setEditingUser(null)
              setUserModalOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* User List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">Liste des Utilisateurs ({mockUsers.length})</h2>
            <div className="space-y-3">
              {mockUsers.map((user) => (
                <Card key={user.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${user.color} text-white font-bold`}
                    >
                      {user.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.name}</p>
                        <Badge className={roleColors[user.role]}>{roleLabels[user.role]}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Dernière connexion: {user.lastConnection}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{user.status === "ACTIVE" ? "Actif" : "Inactif"}</p>
                      <p className="text-xs text-muted-foreground">Actions: {user.actions}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteUser(user)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Roles & Permissions */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Rôles & Permissions</h3>
              <div className="space-y-4">
                {Object.entries(permissions).map(([role, perms]) => (
                  <div key={role} className="space-y-2">
                    <Badge className={roleColors[role as keyof typeof roleColors]}>
                      {roleLabels[role as keyof typeof roleLabels]}
                    </Badge>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {perms.map((perm, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-success" />
                          {perm}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>

            {/* Statistics */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Statistiques</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Connexions aujourd'hui</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actions cette semaine</span>
                  <span className="font-medium">1,47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taux d'activité</span>
                  <span className="font-medium text-success">87%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* UserModal component */}
      <UserModal
        open={userModalOpen}
        onOpenChange={setUserModalOpen}
        user={
          editingUser
            ? {
                id: editingUser.id,
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
              }
            : undefined
        }
        onSave={handleSaveUser}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-center">Supprimer l'utilisateur</DialogTitle>
            <DialogDescription className="text-center">
              Êtes-vous sûr de vouloir supprimer {deleteUser?.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm">
            <p className="text-destructive font-medium">Attention: Cette action est irréversible.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
