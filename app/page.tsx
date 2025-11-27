"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, QrCode, FileText, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary" />
              <span className="text-xl font-bold text-foreground">VPAA Events</span>
            </div>
            <div className="flex gap-4">
              <Link href="/auth/admin/login">
                <Button variant="ghost">Admin Login</Button>
              </Link>
              <Link href="/auth/user/login">
                <Button>User Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
            Professional Event Management Made Simple
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Coordinate events, manage check-ins, and issue digital certificates all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/admin/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Admin Dashboard
              </Button>
            </Link>
            <Link href="/auth/user/login">
              <Button size="lg" variant="outline">
                Attend an Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">Powerful Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Event Management",
                description: "Create and manage multiple events with ease",
              },
              {
                icon: <QrCode className="h-6 w-6" />,
                title: "Smart Check-In",
                description: "QR code based attendee check-in system",
              },
              {
                icon: <FileText className="h-6 w-6" />,
                title: "Certificates",
                description: "Generate and issue digital certificates",
              },
              {
                icon: <CheckCircle2 className="h-6 w-6" />,
                title: "Analytics",
                description: "Real-time event analytics and reports",
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Ready to transform your events?</h2>
          <p className="mb-8 text-muted-foreground">Join VPAA today and streamline your event coordination process.</p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          <p>&copy; 2025 VPAA Event Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
