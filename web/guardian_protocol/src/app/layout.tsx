import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LeftSidebar } from "@/components/left-sidebar";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campus Security System",
  description: "Entity Resolution & Security Monitoring",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <div className="flex h-screen bg-background">
          <LeftSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
        </div>
      </body>
    </html>
  );
}
