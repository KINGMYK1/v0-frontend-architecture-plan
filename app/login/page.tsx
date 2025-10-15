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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0F] p-4">
      {/* Gradient circles in corners */}
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="relative">
             
              <svg width="0" height="0" className="absolute">
                <defs>
                  <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <Shield
                className="h-12 w-12"
                style={{
                  stroke: "url(#shield-gradient)",
                  fill: "url(#shield-gradient)",
                  strokeWidth: 1.5,
                }}
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">MSSP Health Check</h1>
          <p className="mt-2 text-sm text-gray-400">Connexion à votre espace de surveillance</p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Demo Credentials */}
        <div className="space-y-3 text-center">
          <p className="text-sm text-gray-400">Identifiants de démonstration:</p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-500">
              Email: <span className="font-medium text-cyan-400">admin@mssp.com</span>
            </p>
            <p className="text-gray-500">
              Password: <span className="font-medium text-cyan-400">Admin123!</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600">© 2025 MSSP Health Check. Tous droits réservés.</p>
      </div>
    </div>
  )
}
