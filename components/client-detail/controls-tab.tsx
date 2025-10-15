"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Control {
  id: string
  name: string
  status: "OK" | "WARNING" | "CRITICAL"
  value: string
  message: string
}

interface ControlsTabProps {
  title: string
  controls: Control[]
}

export function ControlsTab({ title, controls }: ControlsTabProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OK":
        return <CheckCircle2 className="h-5 w-5 text-success" />
      case "WARNING":
        return <AlertTriangle className="h-5 w-5 text-warning" />
      case "CRITICAL":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OK":
        return "bg-success/10 text-success hover:bg-success/20"
      case "WARNING":
        return "bg-warning/10 text-warning hover:bg-warning/20"
      case "CRITICAL":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid gap-4">
        {controls.map((control) => (
          <Card key={control.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="mt-1">{getStatusIcon(control.status)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{control.name}</h4>
                    <Badge className={cn("text-xs", getStatusColor(control.status))}>{control.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{control.message}</p>
                  <p className="mt-2 text-2xl font-bold">{control.value}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
