"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page on initial load
    router.push("/login")
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">MSSP Health Check</h1>
        <p className="mt-2 text-muted-foreground">Redirection en cours...</p>
      </div>
    </div>
  )
}
