import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function SupabaseError() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-md">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Supabase Configuration Error</AlertTitle>
          <AlertDescription>
            Missing Supabase environment variables. Please set up your Supabase integration.
          </AlertDescription>
        </Alert>

        <div className="rounded-lg border p-6 text-center">
          <h2 className="mb-4 text-xl font-semibold">How to fix this error:</h2>
          <ol className="mb-6 text-left text-sm space-y-2">
            <li>1. Add the Supabase integration to your project</li>
            <li>
              2. Set the required environment variables:
              <ul className="ml-6 mt-1 list-disc">
                <li>NEXT_PUBLIC_SUPABASE_URL</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              </ul>
            </li>
          </ol>
          <Button className="bg-teal-600 hover:bg-teal-700">Add Supabase Integration</Button>
        </div>
      </div>
    </div>
  )
}
