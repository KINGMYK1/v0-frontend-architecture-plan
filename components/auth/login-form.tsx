"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/hooks/use-auth"
import { AlertCircle, Mail, Lock } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  remember: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember: false,
    },
  })

  const rememberMe = watch("remember")

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null)
      await login(data.email, data.password)
      router.push("/dashboard")
    } catch (err) {
      setError("Email ou mot passe incorrect")
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-8 backdrop-blur-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-medium text-white">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="sr-only">
            Adresse email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Adresse email"
              {...register("email")}
              disabled={isLoading}
              className="h-12 border-white/10 bg-gray-800/50 pl-11 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="sr-only">
            Mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={isLoading}
              className="h-12 border-white/10 bg-gray-800/50 pl-11 pr-11 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500"
            />
            <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>
          {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setValue("remember", checked as boolean)}
              className="border-white/20 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
            />
            <label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer">
              Se souvenir de moi
            </label>
          </div>
          <button type="button" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            Mot passe oublié ?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="h-12 w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium hover:from-cyan-600 hover:to-purple-700 transition-all"
          disabled={isLoading}
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </form>
    </div>
  )
}
