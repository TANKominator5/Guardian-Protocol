"use client";

import React from "react";
import { CheckCircle2, Clock, Eye, EyeOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const sampleEntity = {
  entity_id: "E-134",
  names: ["Amit Kumar", "Amit Kr."],
  cards: ["CARD_8871"],
  devices: ["B4:F1:22:AA"],
  last_seen: "09:20",
  status: "SAFE",
  prediction: "Likely in Lab-1 based on AP consistency",
  timeline: [
    {
      timestamp: "09:10",
      event: "Swipe Entry | Main Gate",
      source: "Swipe Log",
      color: "bg-blue-500",
    },
    {
      timestamp: "09:12",
      event: "WiFi Connected | AP Lab-1",
      source: "WiFi Log",
      color: "bg-purple-500",
    },
    {
      timestamp: "09:20",
      event: "CCTV Sighted | Corridor",
      source: "CCTV Log",
      color: "bg-green-500",
    },
  ],
  confidence_scores: {
    name_sim: 0.92,
    device_sim: 1.0,
    face_sim: 0.88,
    final_score: 0.89,
  },
};

export default function DashboardPage() {
  const [showExplainability, setShowExplainability] = React.useState(false);

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Entity Resolution Dashboard
          </h1>
          <p className="text-muted-foreground">
            Query and monitor unified entity profiles across all campus data
            sources
          </p>
        </div>

        {/* Entity Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Entity</CardTitle>
            <CardDescription>
              Choose an entity to view its unified profile and activity timeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <select className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground">
                <option>E-134 (Amit Kumar)</option>
                <option>E-135 (Sarah Johnson)</option>
                <option>E-136 (Michael Chen)</option>
              </select>
              <Button>Load Entity</Button>
            </div>
          </CardContent>
        </Card>

        {/* Alert Banner */}
        {sampleEntity.status === "SAFE" && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-700">
                Entity Status: Safe
              </p>
              <p className="text-sm text-green-600">
                Last seen 20 minutes ago. No alerts triggered.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Entity Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Unified Entity Profile</CardTitle>
                <CardDescription>
                  Entity ID: {sampleEntity.entity_id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    Linked Names
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sampleEntity.names.map((name) => (
                      <Badge key={name} variant="secondary">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    Linked Identifiers
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Card ID</p>
                      <p className="font-mono font-semibold">
                        {sampleEntity.cards[0]}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Device Hash</p>
                      <p className="font-mono font-semibold">
                        {sampleEntity.devices[0]}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>
                  Chronological log of all detected activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleEntity.timeline.map((entry, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${entry.color}`}
                        />
                        {idx < sampleEntity.timeline.length - 1 && (
                          <div className="w-0.5 h-12 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-foreground">
                            {entry.event}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {entry.timestamp}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {entry.source}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prediction */}
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                  Predictive Inference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{sampleEntity.prediction}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Confidence Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Confidence Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-muted-foreground">
                      Name Similarity
                    </p>
                    <span className="font-semibold">
                      {(sampleEntity.confidence_scores.name_sim * 100).toFixed(
                        0
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${
                          sampleEntity.confidence_scores.name_sim * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-muted-foreground">
                      Device Similarity
                    </p>
                    <span className="font-semibold">
                      {(
                        sampleEntity.confidence_scores.device_sim * 100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{
                        width: `${
                          sampleEntity.confidence_scores.device_sim * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-muted-foreground">
                      Face Vector Similarity
                    </p>
                    <span className="font-semibold">
                      {(sampleEntity.confidence_scores.face_sim * 100).toFixed(
                        0
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${
                          sampleEntity.confidence_scores.face_sim * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-foreground">
                      Final Score
                    </p>
                    <span className="text-lg font-bold text-green-500">
                      {(
                        sampleEntity.confidence_scores.final_score * 100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                  <Badge className="mt-2 w-full justify-center bg-green-500/20 text-green-700 hover:bg-green-500/30">
                    High Confidence Match ✓
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Explainability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Explainability Trace</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setShowExplainability(!showExplainability)}
                >
                  {showExplainability ? (
                    <EyeOff className="w-4 h-4 mr-2" />
                  ) : (
                    <Eye className="w-4 h-4 mr-2" />
                  )}
                  {showExplainability ? "Hide" : "Show"} Reasoning
                </Button>
                {showExplainability && (
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="bg-muted/50 rounded p-2">
                      <p className="text-muted-foreground">
                        ✓ Matched via NameSim=0.92 (Amit Kumar vs Amit Kr.)
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded p-2">
                      <p className="text-muted-foreground">
                        ✓ Device seen near same AP within 2 min → DeviceSim=1.0
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded p-2">
                      <p className="text-muted-foreground">
                        ✓ FaceVecSim=0.88 from CCTV embedding
                      </p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded p-2 mt-3">
                      <p className="text-green-700 font-semibold">
                        Final Score = 0.89 → Auto Linked ✓
                      </p>
                    </div>
                  </div>
                )}
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
                <p className="text-2xl font-bold text-foreground">
                  {sampleEntity.last_seen}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  20 minutes ago
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
