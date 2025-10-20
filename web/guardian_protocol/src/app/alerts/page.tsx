"use client";
import {
  AlertTriangle,
  ShieldCheck,
  CircleHelp,
  CheckCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Alert = {
  id: string;
  timestamp: string;
  severity: "High" | "Medium" | "Low";
  description: string;
  entity_id: string;
  status: "New" | "Acknowledged" | "Resolved";
};

const alerts: Alert[] = [
  {
    id: "ALERT-001",
    timestamp: "11:45",
    severity: "High",
    description: "Entity unseen for > 1 hour after campus entry",
    entity_id: "E-135",
    status: "New",
  },
  {
    id: "ALERT-002",
    timestamp: "11:30",
    severity: "Medium",
    description: "Unusual WiFi connection pattern detected",
    entity_id: "E-136",
    status: "New",
  },
  {
    id: "ALERT-003",
    timestamp: "10:50",
    severity: "Low",
    description: "Multiple failed swipe attempts at Lab-3 door",
    entity_id: "UNKNOWN",
    status: "Acknowledged",
  },
  {
    id: "ALERT-004",
    timestamp: "09:15",
    severity: "High",
    description: "Device hash detected in restricted server room",
    entity_id: "E-134",
    status: "Resolved",
  },
  {
    id: "ALERT-005",
    timestamp: "08:40",
    severity: "Medium",
    description: "Face vector mismatch at Main Gate entry",
    entity_id: "E-137",
    status: "Resolved",
  },
];

const severityIcons = {
  High: <AlertTriangle className="w-4 h-4 text-red-500" />,
  Medium: <ShieldCheck className="w-4 h-4 text-yellow-500" />,
  Low: <CircleHelp className="w-4 h-4 text-blue-500" />,
};

const severityBadgeVariant = {
  High: "destructive",
  Medium: "secondary",
  Low: "outline",
} as const;

export default function AlertsPage() {
  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            System Alerts
          </h1>
          <p className="text-muted-foreground">
            Review and manage all triggered security alerts from the system
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active & Recent Alerts</CardTitle>
            <CardDescription>
              A chronological log of all system-generated alerts requiring
              attention.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Timestamp</TableHead>
                  <TableHead className="w-[120px]">Severity</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[120px]">Entity ID</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="text-right w-[180px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-mono">
                      {alert.timestamp}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={severityBadgeVariant[alert.severity]}
                        className="flex items-center gap-2 w-fit"
                      >
                        {severityIcons[alert.severity]}
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {alert.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{alert.entity_id}</Badge>
                    </TableCell>
                    <TableCell>
                      {alert.status === "New" && (
                        <span className="flex items-center gap-2 text-sm text-yellow-600">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                          New
                        </span>
                      )}
                      {alert.status === "Acknowledged" && (
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4" />
                          Acknowledged
                        </span>
                      )}
                      {alert.status === "Resolved" && (
                        <span className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Resolved
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={alert.status !== "New"}
                      >
                        Acknowledge
                      </Button>
                      <Button variant="secondary" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
