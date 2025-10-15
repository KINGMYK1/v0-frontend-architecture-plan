import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "../types"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Mock authentication - check test credentials
        const mockUsers = {
          "admin@mssp.com": {
            id: "1",
            email: "admin@mssp.com",
            name: "Admin User",
            role: "ADMIN" as const,
            createdAt: new Date().toISOString(),
          },
          "technicien@mssp.com": {
            id: "2",
            email: "technicien@mssp.com",
            name: "Technicien SOC",
            role: "TECHNICIEN_SOC" as const,
            createdAt: new Date().toISOString(),
          },
          "manager@mssp.com": {
            id: "3",
            email: "manager@mssp.com",
            name: "Manager",
            role: "MANAGER" as const,
            createdAt: new Date().toISOString(),
          },
        }

        const mockPasswords: Record<string, string> = {
          "admin@mssp.com": "admin123",
          "technicien@mssp.com": "tech123",
          "manager@mssp.com": "manager123",
        }

        const user = mockUsers[email as keyof typeof mockUsers]
        const validPassword = mockPasswords[email]

        if (user && password === validPassword) {
          set({
            user: {
              ...user,
              lastLogin: new Date().toISOString(),
            },
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          set({ isLoading: false })
          throw new Error("Email ou mot de passe incorrect")
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      checkAuth: () => {
        return get().isAuthenticated
      },
    }),
    {
      name: "mssp-auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
