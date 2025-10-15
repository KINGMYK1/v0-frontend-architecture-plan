// Application Constants

export const APP_NAME = "MSSP Health Check"
export const APP_VERSION = "1.0.0"

// Test credentials for mock authentication
export const TEST_CREDENTIALS = {
  admin: {
    email: "admin@mssp.com",
    password: "admin123",
    role: "ADMIN" as const,
  },
  technicien: {
    email: "technicien@mssp.com",
    password: "tech123",
    role: "TECHNICIEN_SOC" as const,
  },
  manager: {
    email: "manager@mssp.com",
    password: "manager123",
    role: "MANAGER" as const,
  },
}

// API Configuration (for future backend integration)
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
  timeout: 30000,
}

// Audit Control Categories
export const CONTROL_CATEGORIES = {
  INVENTORY: "Inventaire & Visibilité",
  COMPLIANCE: "Conformité & Hardening",
  DETECTION: "Détection & Réponse",
  SERVER_HEALTH: "Santé Serveur KSC",
} as const

// Status Colors
export const STATUS_COLORS = {
  OK: "text-success",
  WARNING: "text-warning",
  CRITICAL: "text-destructive",
} as const

export const STATUS_BG_COLORS = {
  OK: "bg-success/10",
  WARNING: "bg-warning/10",
  CRITICAL: "bg-destructive/10",
} as const

// Alert Severity Colors
export const ALERT_SEVERITY_COLORS = {
  CRITICAL: "text-destructive",
  WARNING: "text-warning",
  INFO: "text-primary",
} as const

// Navigation Items
export const NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Clients",
    href: "/clients",
    icon: "Building2",
  },
  {
    title: "Alertes",
    href: "/alerts",
    icon: "AlertTriangle",
  },
  {
    title: "Rapports",
    href: "/reports",
    icon: "FileText",
  },
  {
    title: "Administration",
    href: "/admin",
    icon: "Settings",
    roles: ["ADMIN"],
  },
] as const
