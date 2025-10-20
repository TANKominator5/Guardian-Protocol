"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, AlertCircle, Clock, Users, Settings, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
  {
    label: "Alerts",
    href: "/alerts",
    icon: AlertCircle,
  },
  {
    label: "Timeline",
    href: "/timeline",
    icon: Clock,
  },
  {
    label: "Entities",
    href: "/entities",
    icon: Users,
  },
]

const secondaryItems = [
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    label: "Documentation",
    href: "/docs",
    icon: HelpCircle,
  },
]

export function LeftSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-background flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">CS</span>
          </div>
          <h1 className="font-semibold text-foreground">Campus Security</h1>
        </div>
        <p className="text-xs text-muted-foreground">Entity Resolution System</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">Main</p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <p className="text-xs font-semibold text-foreground mb-3">System Status</p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Entities Tracked</span>
              <span className="font-semibold text-foreground">1,247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active Alerts</span>
              <span className="font-semibold text-red-500">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Sync</span>
              <span className="font-semibold text-foreground">2m ago</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <div className="p-4 border-t border-border space-y-1">
        {secondaryItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
