"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, LockKeyhole, Mail, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const ErrorMessage = ({ error }: { error: string | null }) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertTitle className="text-red-800">Error</AlertTitle>
      <AlertDescription className="text-red-700">{error}</AlertDescription>
    </Alert>
  );
};

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [credentialFailed, setCredentialFailed] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState("");
  const { signIn, resendConfirmationEmail } = useAuth();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setEmailNotConfirmed(false);
    setCredentialFailed(false);

    try {
      const { error } = await signIn(data.email, data.password);

      if (error) {
        console.log("Error signing in:", error.code);
        if (error.code === "invalid_credentials") {
          setCredentialFailed(true);
        }
        ErrorMessage({ error: error.message });
        console.log("Error signing in:", error);
        if (
          error.message.includes("Email not confirmed") ||
          error.code === "401"
        ) {
          setEmailNotConfirmed(true);
          setUnconfirmedEmail(data.email);
          return;
        }

        toast({
          title: "Authentication Failed",
          description:
            error.message || "Invalid email or password. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Login Successful",
        description: "You have been successfully authenticated.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    if (!unconfirmedEmail) return;

    setIsResendingEmail(true);
    try {
      const { error } = await resendConfirmationEmail(unconfirmedEmail);

      if (error) {
        toast({
          title: "Error",
          description:
            error.message ||
            "Failed to resend confirmation email. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Confirmation Email Sent",
        description: "Please check your inbox for the confirmation email.",
      });
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-md">
        <Card className="border-teal-100 shadow-md">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
              <Shield className="h-5 w-5 text-teal-700" />
            </div>
            <CardTitle className="text-teal-700">Login</CardTitle>
            <CardDescription>Access your healthcare account</CardDescription>
          </CardHeader>
          <CardContent>
            {emailNotConfirmed && (
              <Alert
                variant="warning"
                className="mb-6 border-yellow-200 bg-yellow-50"
              >
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">
                  Email Not Confirmed
                </AlertTitle>
                <AlertDescription className="text-yellow-700">
                  <p className="mb-2">
                    Please confirm your email address before logging in.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    onClick={handleResendEmail}
                    disabled={isResendingEmail}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {isResendingEmail
                      ? "Sending..."
                      : "Resend Confirmation Email"}
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            {credentialFailed && (
              <Alert
                variant="warning"
                className="mb-6 border-yellow-200 bg-yellow-50"
              >
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">
                  Email or Password Incorrect
                </AlertTitle>
                <AlertDescription className="text-yellow-700">
                  <p className="mb-2">
                    Please check your email and password and try again.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-teal-600 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
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
                    <span className="text-xs font-medium text-teal-700">
                      Secure Authentication
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    This system uses multi-factor authentication to protect your
                    account.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Authenticating..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-teal-100 bg-gray-50 px-6 py-4">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-teal-600 hover:underline"
              >
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
