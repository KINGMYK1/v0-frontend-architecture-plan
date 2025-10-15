// Core Types for MSSP Health Check Application

export type UserRole = "ADMIN" | "TECHNICIEN_SOC" | "MANAGER"

export type AuditStatus = "OK" | "WARNING" | "CRITICAL"

export type AlertSeverity = "CRITICAL" | "WARNING" | "INFO"

export type AlertStatus = "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED" | "EXPIRED"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
  lastLogin?: string
}

export interface Client {
  id: string
  name: string
  kscUrl: string
  status: AuditStatus
  lastAuditDate?: string
  lastConnectionDate?: string
  isActive: boolean
  auditSchedule?: string
  machineCount?: number
  activeAlerts?: number
  createdAt: string
}

export interface AuditControl {
  id: string
  category: "INVENTORY" | "COMPLIANCE" | "DETECTION" | "SERVER_HEALTH"
  name: string
  status: AuditStatus
  value?: number | string
  threshold?: number
  message?: string
  details?: Record<string, any>
}

export interface Audit {
  id: string
  clientId: string
  clientName: string
  status: AuditStatus
  startTime: string
  endTime?: string
  duration?: number
  controls: AuditControl[]
  summary?: {
    totalControls: number
    okCount: number
    warningCount: number
    criticalCount: number
  }
}

export interface Alert {
  id: string
  clientId: string
  clientName: string
  auditId: string
  controlId: string
  severity: AlertSeverity
  status: AlertStatus
  title: string
  message: string
  count: number
  createdAt: string
  acknowledgedAt?: string
  acknowledgedBy?: string
  resolvedAt?: string
  details?: Record<string, any>
}

export interface DashboardStats {
  totalClients: number
  clientsOk: number
  clientsWarning: number
  clientsCritical: number
  totalAlerts: number
  criticalAlerts: number
  warningAlerts: number
  lastUpdateTime: string
}

export interface Threshold {
  id: string
  clientId?: string // null for global thresholds
  controlId: string
  warningValue?: number
  criticalValue?: number
  description: string
}
