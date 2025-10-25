import { Database } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function EmptyState() {
  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[500px]">
          <Card className="w-full max-w-md border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <Database className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No Entities Found</h2>
              <p className="text-sm text-muted-foreground mb-4">
                There are no entities in the database yet. Start by adding some data to get started.
              </p>
              <p className="text-xs text-muted-foreground">
                Check back once you've populated the database with entity records.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
