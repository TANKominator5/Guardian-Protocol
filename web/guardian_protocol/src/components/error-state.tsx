import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"

interface ErrorStateProps {
  error: string
}

export function ErrorState({ error }: ErrorStateProps) {
  const isSupabaseError = error.includes("Supabase")

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[500px]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="ml-2">
                  <p className="font-semibold mb-2">Error Loading Entities</p>
                  <p className="text-sm mb-3">{error}</p>
                  {isSupabaseError && (
                    <div className="mt-4 p-3 bg-destructive/10 rounded border border-destructive/20">
                      <p className="text-xs font-medium mb-1">How to fix:</p>
                      <p className="text-xs">
                        Go to the <strong>Connect</strong> section in the sidebar and add the Supabase integration with
                        your project credentials.
                      </p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
