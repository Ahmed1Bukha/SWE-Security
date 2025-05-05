"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CheckCircle2, LockKeyhole, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/utils/supabase/client"

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof formSchema>

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isValidLink, setIsValidLink] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    // Check if we have the necessary hash parameters in the URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    if (!hashParams.get("access_token") || !hashParams.get("type") || hashParams.get("type") !== "recovery") {
      setIsValidLink(false)
    }
  }, [])

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) throw error

      setIsComplete(true)
      toast({
        title: "Password Updated",
        description: "Your password has been successfully reset.",
      })

      // Redirect to login after a delay
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem resetting your password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isValidLink) {
    return (
      <div className="container py-8">
        <div className="mx-auto max-w-md">
          <Card className="border-teal-100 shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                <Shield className="h-5 w-5 text-teal-700" />
              </div>
              <CardTitle className="text-teal-700">Invalid Reset Link</CardTitle>
              <CardDescription>This password reset link is invalid or has expired</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 text-center">
              <p className="text-sm text-gray-600">
                Please request a new password reset link from the forgot password page.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                variant="outline"
                className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
                onClick={() => router.push("/forgot-password")}
              >
                Request New Link
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="container py-8">
        <div className="mx-auto max-w-md">
          <Card className="border-teal-100 shadow-md">
            <CardHeader className="bg-teal-50 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                <CheckCircle2 className="h-6 w-6 text-teal-600" />
              </div>
              <CardTitle className="text-teal-700">Password Reset Complete</CardTitle>
              <CardDescription>Your password has been successfully updated</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-gray-600">
                You can now log in with your new password. You will be redirected to the login page shortly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-md">
        <Card className="border-teal-100 shadow-md">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
              <Shield className="h-5 w-5 text-teal-700" />
            </div>
            <CardTitle className="text-teal-700">Reset Password</CardTitle>
            <CardDescription>Create a new password for your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Must be at least 8 characters with uppercase, lowercase, and numbers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="rounded-lg bg-teal-50 p-3">
                  <div className="flex items-center gap-2">
                    <LockKeyhole className="h-4 w-4 text-teal-600" />
                    <span className="text-xs font-medium text-teal-700">Secure Password</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    Choose a strong password that you don't use for other websites.
                  </p>
                </div>

                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Reset Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
