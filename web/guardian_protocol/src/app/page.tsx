"use client"

import { useEffect, useState } from "react"
import { Clock, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import supabase from "@/config/client"
import { EmptyState } from "@/components/empty-state"
import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"

interface Profile {
  id: string
  full_name: string
  mobile_no?: string
  gender?: string
  department?: string
  course?: string
  roll_no?: string
  current_year?: string
  current_semester?: string
  room_id?: string
}

interface Entity {
  entry_id: string
  user_id: string
  status: string
  last_seen: string
  location?: string
  profiles?: Profile | null
}

export default function DashboardPage() {
  const [entities, setEntities] = useState<Entity[]>([])
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setLoading(true)

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          setError(
            "Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
          )
          setLoading(false)
          return
        }

        let { data, error: supabaseError } = await supabase.from("entry").select("*, profiles:profiles!entry_user_id_fkey(*)")
        console.log("Fetched entities with profiles:", data, supabaseError)

        if ((!data || data.length === 0) && !supabaseError) {
          const fallback = await supabase.from("entry").select("*")
          data = fallback.data
          supabaseError = fallback.error
        }

        if (supabaseError) {
          throw supabaseError
        }

        if (data && data.length > 0) {
          const validEntities = data.filter((e) => e.profiles) as Entity[]
          const entitiesToUse = validEntities.length > 0 ? validEntities : (data as Entity[])

          if (entitiesToUse.length > 0) {
            setEntities(entitiesToUse)
            setSelectedEntity(entitiesToUse[0])
          } else {
            setError("No entities found in the database.")
          }
        } else {
          setError("No entities found in the database.")
        }
      } catch (err) {
        console.error("[v0] Error fetching entities:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch entities")
      } finally {
        setLoading(false)
      }
    }

    fetchEntities()
  }, [])

  const handleLoadEntity = (entityId: string) => {
    const entity = entities.find((e) => e.entry_id === entityId)
    if (entity) {
      setSelectedEntity(entity)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  if (!selectedEntity) {
    return <EmptyState />
  }

  const statusColor =
    selectedEntity.status === "active"
      ? "bg-green-500/10 text-green-700"
      : selectedEntity.status === "inactive"
        ? "bg-gray-500/10 text-gray-700"
        : "bg-yellow-500/10 text-yellow-700"

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Entity Resolution Dashboard</h1>
          <p className="text-muted-foreground">Query and monitor unified entity profiles across all data sources</p>
        </div>

        {/* Entity Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Entity</CardTitle>
            <CardDescription>Choose an entity to view its unified profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <select
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                value={selectedEntity.entry_id}
                onChange={(e) => handleLoadEntity(e.target.value)}
              >
                {entities.map((entity) => (
                  <option key={entity.entry_id} value={entity.entry_id}>
                    {entity.profiles?.full_name || entity.user_id} ({entity.entry_id.substring(0, 8)})
                  </option>
                ))}
              </select>
              <Button onClick={() => handleLoadEntity(selectedEntity.entry_id)}>Load Entity</Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Banner */}
        <div className={`${statusColor} border border-current/20 rounded-lg p-4 flex items-start gap-3`}>
          <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold capitalize">Entity Status: {selectedEntity.status}</p>
            <p className="text-sm">Last seen {formatDate(selectedEntity.last_seen)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Entity Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Unified Entity Profile</CardTitle>
                <CardDescription>Entry ID: {selectedEntity.entry_id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Primary Name</p>
                  <p className="text-lg font-semibold text-foreground">
                    {selectedEntity.profiles?.full_name || selectedEntity.user_id}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Entity Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Entry-level metadata */}
                  <div>
                    <p className="text-sm text-muted-foreground">Entry ID</p>
                    <p className="font-mono text-sm">{selectedEntity.entry_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">User ID</p>
                    <p className="font-mono text-sm">{selectedEntity.user_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Seen</p>
                    <p className="font-mono text-sm">{formatDate(selectedEntity.last_seen)}</p>
                  </div>
                  {selectedEntity.location && (
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-mono text-sm">{selectedEntity.location}</p>
                    </div>
                  )}

                  {/* Profile-level metadata */}
                  {selectedEntity.profiles && (
                    <>
                      {selectedEntity.profiles.department && (
                        <div>
                          <p className="text-sm text-muted-foreground">Department</p>
                          <p className="font-mono text-sm">{selectedEntity.profiles.department}</p>
                        </div>
                      )}
                      {selectedEntity.profiles.course && (
                        <div>
                          <p className="text-sm text-muted-foreground">Course</p>
                          <p className="font-mono text-sm">{selectedEntity.profiles.course}</p>
                        </div>
                      )}
                      {selectedEntity.profiles.roll_no && (
                        <div>
                          <p className="text-sm text-muted-foreground">Roll No</p>
                          <p className="font-mono text-sm">{selectedEntity.profiles.roll_no}</p>
                        </div>
                      )}
                      {selectedEntity.profiles.room_id && (
                        <div>
                          <p className="text-sm text-muted-foreground">Room ID</p>
                          <p className="font-mono text-sm">{selectedEntity.profiles.room_id}</p>
                        </div>
                      )}
                      {selectedEntity.profiles.mobile_no && (
                        <div>
                          <p className="text-sm text-muted-foreground">Mobile</p>
                          <p className="font-mono text-sm">{selectedEntity.profiles.mobile_no}</p>
                        </div>
                      )}
                      {selectedEntity.profiles.gender && (
                        <div>
                          <p className="text-sm text-muted-foreground">Gender</p>
                          <p className="font-mono text-sm">{selectedEntity.profiles.gender}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`${statusColor} capitalize`}>{selectedEntity.status}</Badge>
              </CardContent>
            </Card>

            {/* Last Seen */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Last Seen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">{formatDate(selectedEntity.last_seen)}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
