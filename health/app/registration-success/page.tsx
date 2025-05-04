import Link from "next/link"
import { CheckCircle2, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegistrationSuccessPage() {
  return (
    <div className="container flex items-center justify-center py-12">
      <Card className="mx-auto w-full max-w-md border-teal-100 shadow-md">
        <CardHeader className="bg-teal-50 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
            <CheckCircle2 className="h-6 w-6 text-teal-600" />
          </div>
          <CardTitle className="text-teal-700">Registration Complete!</CardTitle>
          <CardDescription>Your account has been created successfully</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="mb-2 text-lg font-medium">Confirm Your Email</h3>
          <p className="mb-4 text-gray-600">
            We've sent a confirmation email to your inbox. Please click the link in the email to verify your account.
          </p>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-left text-sm">
            <p className="font-medium text-blue-800">Important:</p>
            <p className="mt-1 text-blue-700">
              You must confirm your email address before you can log in to your account.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login">
            <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800">
              Proceed to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
