"use client"

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/* <CHANGE> Wrap children with AuthProvider for useAuth hook support */}
      <AuthProvider>{children}</AuthProvider>
      <Analytics />
    </>
  )
}
