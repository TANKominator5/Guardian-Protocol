"use client";

import { useState } from "react";
import { Calendar, Filter, Download, MapPin, User, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const timelineEvents = [
  {
    id: 1,
    timestamp: "09:45",
    date: "2024-10-20",
    event: "CCTV Sighted",
    entity: "Amit Kumar (E-134)",
    location: "Main Gate",
    source: "CCTV Log",
    severity: "info",
    details: "Entity detected at main entrance",
  },
  {
    id: 2,
    timestamp: "09:42",
    date: "2024-10-20",
    event: "WiFi Connected",
    entity: "Sarah Johnson (E-135)",
    location: "Lab-2",
    source: "WiFi Log",
    severity: "info",
    details: "Connected to AP Lab-2",
  },
  {
    id: 3,
    timestamp: "09:38",
    date: "2024-10-20",
    event: "Swipe Entry",
    entity: "Michael Chen (E-136)",
    location: "Building A",
    source: "Swipe Log",
    severity: "warning",
    details: "Unusual access time detected",
  },
  {
    id: 4,
    timestamp: "09:35",
    date: "2024-10-20",
    event: "CCTV Sighted",
    entity: "Amit Kumar (E-134)",
    location: "Corridor 3",
    source: "CCTV Log",
    severity: "info",
    details: "Entity moving through corridor",
  },
  {
    id: 5,
    timestamp: "09:30",
    date: "2024-10-20",
    event: "Device Detected",
    entity: "Sarah Johnson (E-135)",
    location: "Lab-1",
    source: "Device Log",
    severity: "info",
    details: "Device hash B4:F1:22:AA detected",
  },
  {
    id: 6,
    timestamp: "09:25",
    date: "2024-10-20",
    event: "Swipe Entry",
    entity: "Amit Kumar (E-134)",
    location: "Main Gate",
    source: "Swipe Log",
    severity: "info",
    details: "Card CARD_8871 used",
  },
  {
    id: 7,
    timestamp: "09:20",
    date: "2024-10-20",
    event: "Alert Triggered",
    entity: "Unknown Entity",
    location: "Restricted Area",
    source: "Security Alert",
    severity: "critical",
    details: "Unauthorized access attempt detected",
  },
  {
    id: 8,
    timestamp: "09:15",
    date: "2024-10-20",
    event: "WiFi Connected",
    entity: "Michael Chen (E-136)",
    location: "Office-5",
    source: "WiFi Log",
    severity: "info",
    details: "Connected to AP Office-5",
  },
];

const severityConfig = {
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-700",
    badge: "bg-blue-500/20 text-blue-700",
  },
  warning: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-700",
    badge: "bg-yellow-500/20 text-yellow-700",
  },
  critical: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-700",
    badge: "bg-red-500/20 text-red-700",
  },
};

export default function TimelinePage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = timelineEvents.filter((event) => {
    if (selectedFilter !== "all" && event.severity !== selectedFilter)
      return false;
    if (
      searchQuery &&
      !event.entity.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Security Timeline
          </h1>
          <p className="text-muted-foreground">
            Chronological view of all security events and entity activities
            across campus
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by entity name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Severity Filter */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("all")}
          >
            All Events ({timelineEvents.length})
          </Button>
          <Button
            variant={selectedFilter === "critical" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("critical")}
            className={
              selectedFilter === "critical" ? "bg-red-500 hover:bg-red-600" : ""
            }
          >
            Critical (
            {timelineEvents.filter((e) => e.severity === "critical").length})
          </Button>
          <Button
            variant={selectedFilter === "warning" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("warning")}
            className={
              selectedFilter === "warning"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : ""
            }
          >
            Warnings (
            {timelineEvents.filter((e) => e.severity === "warning").length})
          </Button>
          <Button
            variant={selectedFilter === "info" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("info")}
            className={
              selectedFilter === "info" ? "bg-blue-500 hover:bg-blue-600" : ""
            }
          >
            Info ({timelineEvents.filter((e) => e.severity === "info").length})
          </Button>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, idx) => {
              const config =
                severityConfig[event.severity as keyof typeof severityConfig];
              return (
                <Card
                  key={event.id}
                  className={`border ${config.border} ${config.bg}`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Timeline Connector */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${config.badge}`}
                        />
                        {idx < filteredEvents.length - 1 && (
                          <div className="w-0.5 h-20 bg-border mt-2" />
                        )}
                      </div>

                      {/* Event Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">
                                {event.event}
                              </h3>
                              <Badge className={config.badge}>
                                {event.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {event.details}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-sm font-semibold text-foreground">
                              {event.timestamp}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {event.date}
                            </p>
                          </div>
                        </div>

                        {/* Event Metadata */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-foreground">
                              {event.entity}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-foreground">
                              {event.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <Badge variant="outline" className="text-xs">
                              {event.source}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">
                  No events found matching your filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {timelineEvents.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-500">
                {timelineEvents.filter((e) => e.severity === "critical").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Entities Tracked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {new Set(timelineEvents.map((e) => e.entity)).size}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
