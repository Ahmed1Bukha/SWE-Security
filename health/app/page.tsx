"use client"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { ArrowRight, ClipboardList, FileText, ShieldCheck, UserPlus, LockKeyhole } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import WelcomeDashboard from "@/components/welcome-dashboard"
import SupabaseError from "@/components/supabase-error"

export default function Home() {
  const { isAuthenticated, isSupabaseConfigured } = useAuth()

  // Show Supabase error if not configured
  if (!isSupabaseConfigured) {
    return <SupabaseError />
  }

  return (
    <div className="container py-8">
      {isAuthenticated && <WelcomeDashboard />}
      <section className="mb-12 space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-teal-700 md:text-5xl">HealthSecure System</h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
          Secure healthcare management with advanced encryption and authentication
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {!isAuthenticated && (
          <Card className="border-teal-100">
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                <UserPlus className="h-5 w-5 text-teal-700" />
              </div>
              <CardTitle className="text-teal-700">Patient Registration</CardTitle>
              <CardDescription>Register as a new patient</CardDescription>
            </CardHeader>
            <CardContent className="pb-3 text-sm">
              <p>Create a secure account with personal information and credentials.</p>
            </CardContent>
            <CardFooter>
              <Link href="/register" className="w-full">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  Register
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )}

        <Card className="border-teal-100">
          <CardHeader className="pb-3">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
              <FileText className="h-5 w-5 text-teal-700" />
            </div>
            <CardTitle className="text-teal-700">Medical Records</CardTitle>
            <CardDescription>View your medical history</CardDescription>
          </CardHeader>
          <CardContent className="pb-3 text-sm">
            <p>Access your medical records securely with encryption protection.</p>
          </CardContent>
          <CardFooter>
            <Link href="/medical-records" className="w-full">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                View Records
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="border-teal-100">
          <CardHeader className="pb-3">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
              <ClipboardList className="h-5 w-5 text-teal-700" />
            </div>
            <CardTitle className="text-teal-700">Insurance Claims</CardTitle>
            <CardDescription>Manage insurance claims</CardDescription>
          </CardHeader>
          <CardContent className="pb-3 text-sm">
            <p>Process and track insurance claims with digital signatures.</p>
          </CardContent>
          <CardFooter>
            <Link href="/insurance-claims" className="w-full">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                View Claims
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="border-teal-100">
          <CardHeader className="pb-3">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
              <ShieldCheck className="h-5 w-5 text-teal-700" />
            </div>
            <CardTitle className="text-teal-700">Security Features</CardTitle>
            <CardDescription>System security information</CardDescription>
          </CardHeader>
          <CardContent className="pb-3 text-sm">
            <p>Learn about our encryption and authentication measures.</p>
          </CardContent>
          <CardFooter>
            <Link href="/security" className="w-full">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <section className="mt-12 rounded-lg border border-teal-100 bg-teal-50 p-6">
        <div className="flex items-start gap-4">
          <LockKeyhole className="mt-1 h-6 w-6 text-teal-700" />
          <div>
            <h2 className="text-lg font-medium text-teal-800">Secure Healthcare System</h2>
            <p className="mt-2 text-sm text-gray-600">
              HealthSecure implements advanced security measures including data encryption, digital signatures, and
              multi-factor authentication to protect your sensitive medical information.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
