import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function LoadingState() {
  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[500px]">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12 px-6">
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin mb-4" />
              <p className="text-sm font-medium text-foreground">Loading entities...</p>
              <p className="text-xs text-muted-foreground mt-2">Please wait while we fetch your data</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
