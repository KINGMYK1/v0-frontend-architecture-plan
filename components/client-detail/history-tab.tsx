"use client"

import { Badge } from "@/components/ui/badge"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const mockHistoryData = [
  { date: "01/01", ok: 18, warning: 2, critical: 0 },
  { date: "02/01", ok: 17, warning: 3, critical: 0 },
  { date: "03/01", ok: 18, warning: 2, critical: 0 },
  { date: "04/01", ok: 19, warning: 1, critical: 0 },
  { date: "05/01", ok: 18, warning: 2, critical: 0 },
  { date: "06/01", ok: 17, warning: 2, critical: 1 },
  { date: "07/01", ok: 18, warning: 2, critical: 0 },
  { date: "08/01", ok: 19, warning: 1, critical: 0 },
  { date: "09/01", ok: 18, warning: 2, critical: 0 },
  { date: "10/01", ok: 18, warning: 2, critical: 0 },
]

export function HistoryTab() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Évolution des Contrôles (30 derniers jours)</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockHistoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="ok" stroke="hsl(var(--success))" strokeWidth={2} name="OK" />
              <Line type="monotone" dataKey="warning" stroke="hsl(var(--warning))" strokeWidth={2} name="Warning" />
              <Line
                type="monotone"
                dataKey="critical"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                name="Critical"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Historique des Audits</h3>
        <div className="space-y-3">
          {[
            { date: "14/01/2025 10:30", status: "OK", duration: "4m 32s" },
            { date: "13/01/2025 10:30", status: "OK", duration: "4m 18s" },
            { date: "12/01/2025 10:30", status: "WARNING", duration: "4m 45s" },
            { date: "11/01/2025 10:30", status: "OK", duration: "4m 22s" },
            { date: "10/01/2025 10:30", status: "OK", duration: "4m 15s" },
          ].map((audit, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    audit.status === "OK" && "bg-success",
                    audit.status === "WARNING" && "bg-warning",
                    audit.status === "CRITICAL" && "bg-destructive",
                  )}
                />
                <div>
                  <p className="font-medium">{audit.date}</p>
                  <p className="text-sm text-muted-foreground">Durée: {audit.duration}</p>
                </div>
              </div>
              <Badge
                className={cn(
                  audit.status === "OK" && "bg-success/10 text-success",
                  audit.status === "WARNING" && "bg-warning/10 text-warning",
                  audit.status === "CRITICAL" && "bg-destructive/10 text-destructive",
                )}
              >
                {audit.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
