"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CheckCircle2, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Form schemas for each step
const personalInfoSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Please enter a valid date (YYYY-MM-DD)" }),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"], {
    required_error: "Please select a gender option",
  }),
})

const contactInfoSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "State must be at least 2 characters" }),
  zipCode: z.string().min(5, { message: "Zip code must be at least 5 characters" }),
})

const medicalInfoSchema = z.object({
  insuranceProvider: z.string().min(2, { message: "Insurance provider must be at least 2 characters" }),
  insuranceNumber: z.string().min(5, { message: "Insurance number must be at least 5 characters" }),
  primaryPhysician: z.string().optional(),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  emergencyContactName: z.string().min(2, { message: "Emergency contact name must be at least 2 characters" }),
  emergencyContactPhone: z.string().min(10, { message: "Emergency contact phone must be at least 10 digits" }),
})

const consentSchema = z.object({
  privacyConsent: z.enum(["yes"], { required_error: "You must agree to the privacy policy" }),
  dataProcessingConsent: z.enum(["yes"], { required_error: "You must agree to data processing" }),
})

// Combined schema for all steps
const formSchema = z.object({
  ...personalInfoSchema.shape,
  ...contactInfoSchema.shape,
  ...medicalInfoSchema.shape,
  ...consentSchema.shape,
})

type FormValues = z.infer<typeof formSchema>

export default function PatientRegistrationForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: undefined,
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      insuranceProvider: "",
      insuranceNumber: "",
      primaryPhysician: "",
      allergies: "",
      medicalConditions: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      privacyConsent: undefined,
      dataProcessingConsent: undefined,
    },
    mode: "onChange",
  })

  const currentSchema = () => {
    switch (step) {
      case 1:
        return personalInfoSchema
      case 2:
        return contactInfoSchema
      case 3:
        return medicalInfoSchema
      case 4:
        return consentSchema
      default:
        return personalInfoSchema
    }
  }

  const validateCurrentStep = async () => {
    const schema = currentSchema()
    const currentValues = form.getValues()

    // Extract only the fields relevant to the current step
    const relevantFields: Record<string, any> = {}
    Object.keys(schema.shape).forEach((key) => {
      relevantFields[key] = currentValues[key as keyof FormValues]
    })

    try {
      await schema.parseAsync(relevantFields)
      return true
    } catch (error) {
      // Trigger validation to show errors
      Object.keys(schema.shape).forEach((key) => {
        form.trigger(key as keyof FormValues)
      })
      return false
    }
  }

  const nextStep = async () => {
    const isValid = await validateCurrentStep()
    if (isValid) {
      setStep((prev: number) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setStep((prev: number) => Math.max(prev - 1, 1))
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call and encryption process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Success
      setIsComplete(true)
      toast({
        title: "Registration Successful",
        description: "Your patient record has been created successfully.",
      })

      // In a real app, you would redirect to a confirmation page or dashboard
      // router.push('/registration-complete')
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-teal-700">Personal Information</CardTitle>
              <CardDescription>Please provide your basic personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">Other</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="prefer-not-to-say" />
                          </FormControl>
                          <FormLabel className="font-normal">Prefer not to say</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </>
        )
      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-teal-700">Contact Information</CardTitle>
              <CardDescription>Please provide your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AL">Alabama</SelectItem>
                            <SelectItem value="AK">Alaska</SelectItem>
                            <SelectItem value="AZ">Arizona</SelectItem>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="CO">Colorado</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            {/* Add more states as needed */}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </>
        )
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-teal-700">Medical Information</CardTitle>
              <CardDescription>Please provide your medical details and emergency contact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="insuranceProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Provider</FormLabel>
                      <FormControl>
                        <Input placeholder="Blue Cross Blue Shield" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="insuranceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Number</FormLabel>
                      <FormControl>
                        <Input placeholder="XYZ123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="primaryPhysician"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Physician (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List any allergies you have" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Conditions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List any medical conditions you have"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 987-6543" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </>
        )
      case 4:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-teal-700">Consent & Privacy</CardTitle>
              <CardDescription>Please review and provide consent to our policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-teal-50 p-4">
                <div className="mb-4 flex items-center">
                  <ShieldCheck className="mr-2 h-5 w-5 text-teal-600" />
                  <h3 className="text-sm font-medium text-teal-800">Data Security</h3>
                </div>
                <p className="text-sm text-gray-600">
                  All your personal and medical information will be encrypted and stored securely in compliance with
                  healthcare regulations.
                </p>
              </div>

              <FormField
                control={form.control}
                name="privacyConsent"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Privacy Policy Consent</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal">I have read and agree to the Privacy Policy</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Our privacy policy explains how we collect, use, and protect your personal information.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataProcessingConsent"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Data Processing Consent</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            I consent to the processing of my personal and medical data
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      We need your consent to process your data for healthcare services.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </>
        )
      default:
        return null
    }
  }

  if (isComplete) {
    return (
      <Card className="border-teal-100 shadow-md">
        <CardHeader className="bg-teal-50 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
            <CheckCircle2 className="h-6 w-6 text-teal-600" />
          </div>
          <CardTitle className="text-teal-700">Registration Complete!</CardTitle>
          <CardDescription>Your patient record has been created successfully</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <p className="mb-4 text-gray-600">
            Thank you for registering with our healthcare system. Your information has been securely stored.
          </p>
          <p className="text-sm text-gray-500">
            You will receive a confirmation email shortly with your patient ID and next steps.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
            onClick={() => router.push("/")}
          >
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="border-teal-100 shadow-md">
          <div className="border-b border-teal-100 bg-teal-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-teal-700">Step {step} of 4</div>
              <div className="flex w-full max-w-[240px] items-center justify-between">
                <div className={`h-2 w-full rounded-full ${step >= 1 ? "bg-teal-500" : "bg-gray-200"}`} />
                <div className="mx-1 h-2 w-2" />
                <div className={`h-2 w-full rounded-full ${step >= 2 ? "bg-teal-500" : "bg-gray-200"}`} />
                <div className="mx-1 h-2 w-2" />
                <div className={`h-2 w-full rounded-full ${step >= 3 ? "bg-teal-500" : "bg-gray-200"}`} />
                <div className="mx-1 h-2 w-2" />
                <div className={`h-2 w-full rounded-full ${step >= 4 ? "bg-teal-500" : "bg-gray-200"}`} />
              </div>
            </div>
          </div>

          {renderStepContent()}

          <CardFooter className="flex justify-between border-t border-teal-100 bg-gray-50 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {step < 4 ? (
              <Button type="button" onClick={nextStep} className="bg-teal-600 hover:bg-teal-700">
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
                {isSubmitting ? "Processing..." : "Complete Registration"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
