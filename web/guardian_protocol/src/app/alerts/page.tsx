"use client";
import {
  AlertTriangle,
  ShieldCheck,
  CircleHelp,
  CheckCircle,
  Inbox,
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
import { Skeleton } from "@/components/ui/skeleton";
import supabase from "../../config/client";
import { useEffect, useState } from "react";

type Alert = {
  id: string;
  created_at: string;
  severity: "High" | "Medium" | "Low";
  description: string;
  entity_id: string;
  status: "New" | "Acknowledged" | "Resolved";
};

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

function AlertTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell className="text-right">
            <div className="flex gap-2 justify-end">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function EmptyAlertsState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-lg bg-muted p-3 mb-4">
        <Inbox className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        No alerts yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Your system is running smoothly. Alerts will appear here when security
        events are detected.
      </p>
    </div>
  );
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data, error } = await supabase.from("alerts").select("*");
      if (error) {
        console.error("Error fetching alerts:", error.message);
      } else {
        setAlerts(data as Alert[]);
      }
      setLoading(false);
    };

    fetchAlerts();
  }, []);

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
            {loading ? (
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
                  <AlertTableSkeleton />
                </TableBody>
              </Table>
            ) : alerts.length === 0 ? (
              <EmptyAlertsState />
            ) : (
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
                        {new Date(alert.created_at).toLocaleTimeString()}
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
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
