"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Eye, EyeOff } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Entity Resolution Engine",
    href: "#",
    description:
      "Core matching logic using fuzzy name matching (Jaro-Winkler), device hash similarity, and face vector cosine distance.",
  },
  {
    title: "Cross-Source Linking & Timeline Fusion",
    href: "#",
    description:
      "Merges all logs in chronological order, attaching source provenance as metadata to build a unified timeline.",
  },
  {
    title: "Predictive Monitoring",
    href: "#",
    description:
      "An ML inference layer that extracts features like last seen location to predict an entity's state.",
  },
  {
    title: "Graph-Based Linker",
    href: "#",
    description:
      "Runs connected components to group nodes into a 'Unified Entity Cluster' based on a confidence score.",
  },
  {
    title: "UI Dashboard & Alerts",
    href: "#",
    description:
      "A user interface with dropdown-based queries, a visual timeline, and an intelligent alert layer.",
  },
  {
    title: "Explainability",
    href: "#",
    description:
      "Provides a reasoning trace for each match, showing similarity scores and the final system decision.",
  },
];

// Sample entity data
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

export default function App() {
  const [showExplainability, setShowExplainability] = React.useState(false);

  return (
    <>
      {/* Navigation Menu */}
      <nav className="border-b border-border bg-background">
        <NavigationMenu>
          <NavigationMenuList className="flex-wrap">
            <NavigationMenuItem>
              <NavigationMenuTrigger>Home</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                        href="/"
                      >
                        <div className="mb-2 text-lg font-medium sm:mt-4">
                          Campus Security System
                        </div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          An AI-assisted system that unifies logs, resolves
                          entity identities, reconstructs timelines, and raises
                          intelligent alerts.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="#" title="Project Overview">
                    Unify identities across fragmented systems using name
                    similarity, device hash correlation, and face embeddings.
                  </ListItem>
                  <ListItem href="#" title="Tech Stack">
                    Built with Python (FastAPI), Pandas, scikit-learn,
                    RapidFuzz, and Streamlit for the UI.
                  </ListItem>
                  <ListItem href="#" title="System Architecture">
                    A multi-layered system from data normalization to a
                    predictive model and UI visualization.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Core Features</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="#">Docs</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden md:block">
              <NavigationMenuTrigger>Details</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="#">
                        <div className="font-medium">Similarity Metrics</div>
                        <div className="text-muted-foreground">
                          Definitions for NameSim, DeviceSim, and FaceVecSim.
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">
                        <div className="font-medium">
                          Confidence Score Fusion
                        </div>
                        <div className="text-muted-foreground">
                          Learn how scores are weighted and combined.
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">
                        <div className="font-medium">API Contract</div>
                        <div className="text-muted-foreground">
                          Example GET request for resolving an entity.
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden md:block">
              <NavigationMenuTrigger>Enhancements</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="#">NLP Enhancements</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">Anomaly Detection</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">Privacy Enhancements</Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* Main Content */}
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
                Choose an entity to view its unified profile and activity
                timeline
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
                        {(
                          sampleEntity.confidence_scores.name_sim * 100
                        ).toFixed(0)}
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
                        {(
                          sampleEntity.confidence_scores.face_sim * 100
                        ).toFixed(0)}
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
                  <CardTitle className="text-lg">
                    Explainability Trace
                  </CardTitle>
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
                          ✓ Device seen near same AP within 2 min →
                          DeviceSim=1.0
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
    </>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
