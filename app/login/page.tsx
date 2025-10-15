"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/lib/hooks/use-auth"
import { Shield } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">MSSP Health Check</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Plateforme de surveillance automatisée Kaspersky Security Center
          </p>
        </div>

        {/* Login Form */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-lg">
          <h2 className="mb-6 text-xl font-semibold">Connexion</h2>
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">Version 1.0.0 - Environnement de développement</p>
      </div>
    </div>
  )
}
