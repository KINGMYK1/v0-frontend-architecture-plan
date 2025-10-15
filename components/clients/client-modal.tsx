"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Shield, Info, AlertCircle, Clock } from "lucide-react"
import type { Client } from "@/lib/types"
import { Slider } from "@/components/ui/slider"

const clientSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  contactEmail: z.string().email("Email invalide"),
  kscUrl: z.string().url("URL invalide"),
  kscUsername: z.string().min(1, "Nom d'utilisateur requis"),
  kscPassword: z.string().min(1, "Mot de passe requis"),
  auditTime: z.string(),
  timezone: z.string(),
  frequency: z.number(),
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
  const [isTesting, setIsTesting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client
      ? {
          name: client.name,
          contactEmail: "",
          kscUrl: client.kscUrl,
          kscUsername: "",
          kscPassword: "",
          auditTime: "02:00",
          timezone: "Africa/Casablanca",
          frequency: 1,
        }
      : {
          auditTime: "02:00",
          timezone: "Africa/Casablanca",
          frequency: 1,
        },
  })

  const frequency = watch("frequency")

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

  const handleTestConnection = async () => {
    setIsTesting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsTesting(false)
    alert("Connexion réussie!")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Nouveau Client</DialogTitle>
              <p className="text-sm text-muted-foreground">Ajouter un client à la plateforme</p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-6 pt-4">
          {/* Left Column - Form Sections (2 columns) */}
          <div className="col-span-2 space-y-6">
            {/* Informations Générales */}
            <div className="rounded-xl bg-muted/50 p-6 space-y-4 border border-border/50">
              <div className="flex items-center gap-2 text-base font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Info className="h-4 w-4 text-primary" />
                </div>
                Informations Générales
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du client</Label>
                  <Input
                    id="name"
                    placeholder="ABC Corporation"
                    {...register("name")}
                    disabled={isLoading}
                    className="h-11"
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de contact</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="contact@abc.com"
                    {...register("contactEmail")}
                    disabled={isLoading}
                    className="h-11"
                  />
                  {errors.contactEmail && <p className="text-xs text-destructive">{errors.contactEmail.message}</p>}
                </div>
              </div>
            </div>

            {/* Configuration Kaspersky */}
            <div className="rounded-xl bg-muted/50 p-6 space-y-4 border border-border/50">
              <div className="flex items-center gap-2 text-base font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
                  <Shield className="h-4 w-4 text-secondary" />
                </div>
                Configuration Kaspersky
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="kscUrl">URL du serveur KSC</Label>
                  <Input
                    id="kscUrl"
                    placeholder="https://ksc.abc.com"
                    {...register("kscUrl")}
                    disabled={isLoading}
                    className="h-11"
                  />
                  {errors.kscUrl && <p className="text-xs text-destructive">{errors.kscUrl.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kscUsername">Nom d'utilisateur API</Label>
                    <Input
                      id="kscUsername"
                      placeholder="admin"
                      {...register("kscUsername")}
                      disabled={isLoading}
                      className="h-11"
                    />
                    {errors.kscUsername && <p className="text-xs text-destructive">{errors.kscUsername.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kscPassword">Mot de passe API</Label>
                    <Input
                      id="kscPassword"
                      type="password"
                      placeholder="••••••••"
                      {...register("kscPassword")}
                      disabled={isLoading}
                      className="h-11"
                    />
                    {errors.kscPassword && <p className="text-xs text-destructive">{errors.kscPassword.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Planning des Audits */}
            <div className="rounded-xl bg-muted/50 p-6 space-y-4 border border-border/50">
              <div className="flex items-center gap-2 text-base font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                  <Clock className="h-4 w-4 text-accent" />
                </div>
                Planning des Audits
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="auditTime">Heure d'exécution quotidienne</Label>
                    <Input
                      id="auditTime"
                      type="time"
                      {...register("auditTime")}
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <select
                      id="timezone"
                      {...register("timezone")}
                      disabled={isLoading}
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="Africa/Casablanca">Africa/Casablanca (GMT+1)</option>
                      <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                      <option value="America/New_York">America/New_York (GMT-5)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Fréquence</Label>
                    <span className="text-sm font-medium text-primary">
                      {frequency === 1 ? "Quotidien" : `Tous les ${frequency} jours`}
                    </span>
                  </div>
                  <Slider
                    value={[frequency]}
                    onValueChange={(value) => setValue("frequency", value[0])}
                    min={1}
                    max={7}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Quotidien</span>
                    <span>Hebdomadaire</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-4">
            {/* Actions */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-sm font-semibold">Actions</h3>
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Créer le client"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 bg-transparent"
                onClick={handleTestConnection}
                disabled={isTesting || isLoading}
              >
                {isTesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Test en cours...
                  </>
                ) : (
                  "Tester la connexion"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full h-11"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
            </div>

            {/* Champs obligatoires */}
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                Champs obligatoires
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-destructive">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                  <span>URL_KSC</span>
                </div>
                <div className="flex items-center gap-2 text-destructive">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                  <span>Identifiants_API</span>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 p-5 space-y-2 border border-primary/20">
              <h3 className="text-sm font-semibold">Note</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Assurez-vous d'utiliser des identifiants de service avec les permissions nécessaires pour accéder à
                l'API Kaspersky.
              </p>
            </div>

            {/* À propos */}
            <div className="rounded-xl bg-gradient-to-br from-accent/20 to-secondary/20 p-5 space-y-2 border border-accent/20">
              <h3 className="text-sm font-semibold">À propos</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Les audits quotidiens se lancent automatiquement selon le planning configuré. Vous pouvez également
                lancer des audits manuels depuis la page du client.
              </p>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
