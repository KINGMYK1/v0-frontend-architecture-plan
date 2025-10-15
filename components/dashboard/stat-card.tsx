import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "success" | "warning" | "destructive" | "info"
  className?: string
}

export function StatCard({ title, value, icon: Icon, trend, variant = "default", className }: StatCardProps) {
  const variantStyles = {
    default: "bg-card border-border",
    success: "bg-success/10 border-success/30",
    warning: "bg-warning/10 border-warning/30",
    destructive: "bg-destructive/10 border-destructive/30",
    info: "bg-primary/10 border-primary/30",
  }

  const iconStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    destructive: "bg-destructive/20 text-destructive",
    info: "bg-primary/20 text-primary",
  }

  return (
    <div className={cn("rounded-lg border p-6", variantStyles[variant], className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {trend && (
            <p className={cn("mt-2 text-sm", trend.isPositive ? "text-success" : "text-destructive")}>
              {trend.isPositive ? "+" : ""}
              {trend.value}% vs semaine dernière
            </p>
          )}
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg", iconStyles[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
