"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./use-auth"

export function useRequireAuth() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  return { isAuthenticated, user }
}
