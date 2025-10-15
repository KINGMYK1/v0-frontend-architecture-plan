"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { Client } from "@/lib/types"

const clientSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  kscUrl: z.string().url("URL invalide"),
  kscUsername: z.string().min(1, "Nom d'utilisateur requis"),
  kscPassword: z.string().min(1, "Mot de passe requis"),
})

type ClientFormData = z.infer<typeof clientSchema>

interface ClientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client
  onSave: (data: ClientFormData) => Promise<void>
}

export function ClientModal({ open, onOpenChange, client, onSave }: ClientModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client
      ? {
          name: client.name,
          kscUrl: client.kscUrl,
          kscUsername: "",
          kscPassword: "",
        }
      : undefined,
  })

  const onSubmit = async (data: ClientFormData) => {
    setIsLoading(true)
    try {
      await onSave(data)
      reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving client:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{client ? "Modifier le client" : "Ajouter un client"}</DialogTitle>
          <DialogDescription>
            {client
              ? "Modifiez les informations du client et de son serveur KSC."
              : "Ajoutez un nouveau client et configurez la connexion à son serveur KSC."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du client</Label>
            <Input id="name" placeholder="Entreprise ABC" {...register("name")} disabled={isLoading} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="kscUrl">URL du serveur KSC</Label>
            <Input id="kscUrl" placeholder="https://ksc.example.com" {...register("kscUrl")} disabled={isLoading} />
            {errors.kscUrl && <p className="text-sm text-destructive">{errors.kscUrl.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="kscUsername">Nom d'utilisateur KSC</Label>
            <Input id="kscUsername" placeholder="admin" {...register("kscUsername")} disabled={isLoading} />
            {errors.kscUsername && <p className="text-sm text-destructive">{errors.kscUsername.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="kscPassword">Mot de passe KSC</Label>
            <Input
              id="kscPassword"
              type="password"
              placeholder="••••••••"
              {...register("kscPassword")}
              disabled={isLoading}
            />
            {errors.kscPassword && <p className="text-sm text-destructive">{errors.kscPassword.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
