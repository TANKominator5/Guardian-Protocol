"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ChevronRight, AlertCircle, CheckCircle2, Clock, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@supabase/supabase-js"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { EmptyState } from "@/components/empty-state"

type Entity = {
  id: string
  entity_id: string
  event_type: string
  source: string
  location_id: string
  timestamp: string
  details: any
  primary_name?: string
  aliases?: string[]
  status?: "SAFE" | "ALERT"
  last_seen?: string
  confidence_score?: number
  location?: string
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([])
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SAFE" | "ALERT">("ALL")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          setError(
            "Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
          )
          setLoading(false)
          return
        }

        const { data, error: supabaseError } = await supabase.from("profiles").select("*")

        console.log("Fetched entities:", data, supabaseError)

        if (supabaseError) {
          throw supabaseError
        }

        if (data && data.length > 0) {
          const mappedEntities = data.map((event) => ({
            id: event.id,
            entity_id: event.entity_id,
            event_type: event.event_type,
            source: event.source,
            location_id: event.location_id,
            timestamp: event.timestamp,
            details: event.details,
            primary_name: event.details?.primary_name || "Unknown",
            aliases: event.details?.aliases || [],
            status: event.details?.status || "SAFE",
            last_seen: new Date(event.timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            confidence_score: event.details?.confidence_score || 0.9,
            location: event.details?.location || event.location_id,
          }))

          setEntities(mappedEntities)
          setSelectedEntity(mappedEntities[0])
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

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  if (entities.length === 0) {
    return <EmptyState />
  }

  const filteredEntities = entities.filter((entity) => {
    const matchesSearch =
      entity.entity_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entity.primary_name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entity.aliases || []).some((alias) => alias.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "ALL" || entity.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const safeCount = entities.filter((e) => e.status === "SAFE").length
  const alertCount = entities.filter((e) => e.status === "ALERT").length

  const statusColor =
    selectedEntity?.status === "SAFE"
      ? "bg-green-500/10 text-green-700 border-green-200"
      : "bg-yellow-500/10 text-yellow-700 border-yellow-200"

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Entities Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage all unified entity profiles across the system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Entities</p>
                  <p className="text-2xl font-bold text-foreground">{entities.length}</p>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Safe Status</p>
                  <p className="text-2xl font-bold text-green-600">{safeCount}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Alerts</p>
                  <p className="text-2xl font-bold text-red-600">{alertCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Entity List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search & Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Search & Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by entity ID, name, or alias..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={statusFilter === "ALL" ? "default" : "outline"}
                    onClick={() => setStatusFilter("ALL")}
                    size="sm"
                  >
                    All Entities
                  </Button>
                  <Button
                    variant={statusFilter === "SAFE" ? "default" : "outline"}
                    onClick={() => setStatusFilter("SAFE")}
                    size="sm"
                  >
                    Safe
                  </Button>
                  <Button
                    variant={statusFilter === "ALERT" ? "default" : "outline"}
                    onClick={() => setStatusFilter("ALERT")}
                    size="sm"
                  >
                    Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Entities Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Entities ({filteredEntities.length} of {entities.length})
                </CardTitle>
                <CardDescription>Click on any entity to view detailed profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Entity ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Confidence</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Location</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Last Seen</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEntities.length > 0 ? (
                        filteredEntities.map((entity) => (
                          <tr
                            key={entity.id}
                            className={`border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${
                              selectedEntity?.id === entity.id ? "bg-muted/30" : ""
                            }`}
                            onClick={() => setSelectedEntity(entity)}
                          >
                            <td className="py-3 px-4">
                              <span className="font-mono font-semibold text-foreground">{entity.entity_id}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-semibold text-foreground">{entity.primary_name}</p>
                                <p className="text-xs text-muted-foreground">{entity.aliases?.join(", ") || ""}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={entity.status === "SAFE" ? "default" : "destructive"}>
                                {entity.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-muted rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{
                                      width: `${entity.confidence_score! * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs font-semibold">
                                  {(entity.confidence_score! * 100).toFixed(0)}%
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-foreground">{entity.location}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-muted-foreground">{entity.last_seen}</span>
                            </td>
                            <td className="py-3 px-4">
                              <Link href={`/entity/${entity.entity_id}`}>
                                <Button variant="ghost" size="sm" className="gap-1">
                                  View
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-8 text-center">
                            <p className="text-muted-foreground">No entities found matching your search criteria</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Entity Details */}
          {selectedEntity && (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className={`${statusColor} border rounded-lg p-4 flex items-start gap-3`}>
                <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold capitalize">Entity Status: {selectedEntity.status}</p>
                  <p className="text-sm">Last seen {selectedEntity.last_seen}</p>
                </div>
              </div>

              {/* Entity Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Entity Profile</CardTitle>
                  <CardDescription>{selectedEntity.entity_id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Primary Name</p>
                    <p className="text-lg font-semibold text-foreground">{selectedEntity.primary_name}</p>
                  </div>

                  {selectedEntity.aliases && selectedEntity.aliases.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Aliases</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedEntity.aliases.map((alias, idx) => (
                          <Badge key={idx} variant="secondary">
                            {alias}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Metadata Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Source</p>
                    <p className="font-mono text-sm">{selectedEntity.source}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-mono text-sm">{selectedEntity.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Confidence Score</p>
                    <p className="font-mono text-sm">{(selectedEntity.confidence_score! * 100).toFixed(1)}%</p>
                  </div>
                </CardContent>
              </Card>

              {/* Last Seen Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Last Seen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">{selectedEntity.last_seen}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
