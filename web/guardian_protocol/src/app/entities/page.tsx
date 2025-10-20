"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Sample entities data
const sampleEntities = [
  {
    entity_id: "E-134",
    primary_name: "Amit Kumar",
    aliases: ["Amit Kr.", "A. Kumar"],
    status: "SAFE",
    last_seen: "09:20",
    confidence_score: 0.89,
    location: "Lab-1",
    card_id: "CARD_8871",
    device_hash: "B4:F1:22:AA",
  },
  {
    entity_id: "E-135",
    primary_name: "Sarah Johnson",
    aliases: ["S. Johnson"],
    status: "SAFE",
    last_seen: "08:45",
    confidence_score: 0.92,
    location: "Office-2",
    card_id: "CARD_8872",
    device_hash: "C5:G2:33:BB",
  },
  {
    entity_id: "E-136",
    primary_name: "Michael Chen",
    aliases: ["M. Chen", "Mike Chen"],
    status: "ALERT",
    last_seen: "07:30",
    confidence_score: 0.85,
    location: "Unknown",
    card_id: "CARD_8873",
    device_hash: "D6:H3:44:CC",
  },
  {
    entity_id: "E-137",
    primary_name: "Emma Wilson",
    aliases: ["E. Wilson"],
    status: "SAFE",
    last_seen: "09:15",
    confidence_score: 0.88,
    location: "Cafeteria",
    card_id: "CARD_8874",
    device_hash: "E7:I4:55:DD",
  },
  {
    entity_id: "E-138",
    primary_name: "David Martinez",
    aliases: ["D. Martinez", "Dave M."],
    status: "SAFE",
    last_seen: "09:05",
    confidence_score: 0.91,
    location: "Main Gate",
    card_id: "CARD_8875",
    device_hash: "F8:J5:66:EE",
  },
  {
    entity_id: "E-139",
    primary_name: "Lisa Anderson",
    aliases: ["L. Anderson"],
    status: "ALERT",
    last_seen: "06:50",
    confidence_score: 0.79,
    location: "Restricted Area",
    card_id: "CARD_8876",
    device_hash: "G9:K6:77:FF",
  },
];

export default function EntitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SAFE" | "ALERT">(
    "ALL"
  );

  const filteredEntities = sampleEntities.filter((entity) => {
    const matchesSearch =
      entity.entity_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.primary_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.aliases.some((alias) =>
        alias.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "ALL" || entity.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const safeCount = sampleEntities.filter((e) => e.status === "SAFE").length;
  const alertCount = sampleEntities.filter((e) => e.status === "ALERT").length;

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Entities</h1>
          <p className="text-muted-foreground">
            Monitor and manage all unified entity profiles across the system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Entities
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {sampleEntities.length}
                  </p>
                </div>
                <div className="text-3xl font-bold text-muted-foreground/30">
                  👥
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Safe Status</p>
                  <p className="text-2xl font-bold text-green-600">
                    {safeCount}
                  </p>
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
                  <p className="text-2xl font-bold text-red-600">
                    {alertCount}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
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
              Entities ({filteredEntities.length} of {sampleEntities.length})
            </CardTitle>
            <CardDescription>
              Click on any entity to view detailed profile and timeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                      Entity ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                      Confidence
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                      Last Seen
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntities.length > 0 ? (
                    filteredEntities.map((entity) => (
                      <tr
                        key={entity.entity_id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="font-mono font-semibold text-foreground">
                            {entity.entity_id}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-foreground">
                              {entity.primary_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {entity.aliases.join(", ")}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              entity.status === "SAFE"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {entity.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{
                                  width: `${entity.confidence_score * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs font-semibold">
                              {(entity.confidence_score * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-foreground">
                            {entity.location}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-muted-foreground">
                            {entity.last_seen}
                          </span>
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
                        <p className="text-muted-foreground">
                          No entities found matching your search criteria
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
