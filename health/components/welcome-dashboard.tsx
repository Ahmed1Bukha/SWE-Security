"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, FileText, HeartPulse, ShieldCheck } from "lucide-react"

export default function WelcomeDashboard() {
  const { user, isSupabaseConfigured } = useAuth()

  if (!isSupabaseConfigured || !user) return null

  const firstName = user.user_metadata?.first_name || user.email?.split("@")[0] || "Patient"

  return (
    <div className="mb-8">
      <Card className="border-teal-100 bg-gradient-to-r from-teal-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl text-teal-700">Welcome, {firstName}</CardTitle>
          <CardDescription>Your healthcare dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg border border-teal-100 bg-white p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                <HeartPulse className="h-5 w-5 text-teal-700" />
              </div>
              <div>
                <p className="text-sm font-medium">Health Status</p>
                <p className="text-xs text-muted-foreground">Good</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-teal-100 bg-white p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                <CalendarDays className="h-5 w-5 text-teal-700" />
              </div>
              <div>
                <p className="text-sm font-medium">Next Appointment</p>
                <p className="text-xs text-muted-foreground">May 15, 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-teal-100 bg-white p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                <FileText className="h-5 w-5 text-teal-700" />
              </div>
              <div>
                <p className="text-sm font-medium">Medical Records</p>
                <p className="text-xs text-muted-foreground">5 records</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-teal-100 bg-white p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                <ShieldCheck className="h-5 w-5 text-teal-700" />
              </div>
              <div>
                <p className="text-sm font-medium">Security Status</p>
                <p className="text-xs text-muted-foreground">Protected</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
