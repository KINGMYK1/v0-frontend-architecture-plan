"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, User, Mail, Lock, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const userSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  role: z.enum(["ADMIN", "TECHNICIEN_SOC", "MANAGER"]),
})

type UserFormData = z.infer<typeof userSchema>

interface UserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: {
    id: string
    name: string
    email: string
    role: "ADMIN" | "TECHNICIEN_SOC" | "MANAGER"
  }
  onSave: (data: UserFormData) => Promise<void>
}

const roleLabels = {
  ADMIN: "Administrateur",
  TECHNICIEN_SOC: "Technicien SOC",
  MANAGER: "Manager",
}

const roleDescriptions = {
  ADMIN: "Accès complet au système, gestion des utilisateurs et configuration globale",
  TECHNICIEN_SOC: "Lecture des données, lancement d'audits et acquittement des alertes",
  MANAGER: "Lecture seule, consultation et export des rapports",
}

export function UserModal({ open, onOpenChange, user, onSave }: UserModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          password: "",
          role: user.role,
        }
      : {
          role: "TECHNICIEN_SOC",
        },
  })

  const selectedRole = watch("role")

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true)
    try {
      await onSave(data)
      reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{user ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {user ? "Mettre à jour les informations" : "Ajouter un nouvel utilisateur à la plateforme"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Informations Personnelles
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" placeholder="John Doe" {...register("name")} disabled={isLoading} className="h-11" />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@mssp.com"
                    {...register("email")}
                    disabled={isLoading}
                    className="h-11 pl-10"
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{user ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLoading}
                  className="h-11 pl-10"
                />
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              <p className="text-xs text-muted-foreground">Minimum 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre</p>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Rôle et Permissions
            </h3>
            <div className="grid gap-3">
              {(Object.keys(roleLabels) as Array<keyof typeof roleLabels>).map((role) => (
                <label
                  key={role}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-colors ${
                    selectedRole === role
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <input type="radio" value={role} {...register("role")} className="mt-1" disabled={isLoading} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{roleLabels[role]}</span>
                      <Badge variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{roleDescriptions[role]}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : user ? (
                "Mettre à jour"
              ) : (
                "Créer l'utilisateur"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
