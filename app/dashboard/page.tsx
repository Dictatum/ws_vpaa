"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, LogOut, Settings, Calendar, Users, FileText, BarChart3 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/auth/login")
      return
    }

    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: false })

        if (!error && data) {
          setEvents(data)
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [user, authLoading, router, supabase])

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">VPAA Events</h1>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/analytics">
                <Button variant="ghost" size="sm" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back! Manage your events below.</p>
          </div>
          <Link href="/dashboard/events/create">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              New Event
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="attendees" className="gap-2">
              <Users className="h-4 w-4" />
              Attendees
            </TabsTrigger>
            <TabsTrigger value="certificates" className="gap-2">
              <FileText className="h-4 w-4" />
              Certificates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { label: "Total Events", value: events.length, icon: Calendar },
                { label: "Active Events", value: events.filter((e) => e.status === "active").length, icon: Calendar },
                { label: "Total Attendees", value: "0", icon: Users },
                { label: "Certificates Issued", value: "0", icon: FileText },
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                        <Icon className="h-5 w-5 text-primary/40" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            {events.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Calendar className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No events yet. Create your first event to get started.</p>
                  <Link href="/dashboard/events/create" className="mt-4 inline-block">
                    <Button className="bg-primary hover:bg-primary/90">Create Event</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {events.map((event: any) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{event.name}</CardTitle>
                          <CardDescription>{event.event_date}</CardDescription>
                        </div>
                        <Link href={`/dashboard/events/${event.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="attendees">
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-muted-foreground">Select an event to view attendees</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates">
            <Card>
              <CardContent className="pt-6 text-center">
                <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-muted-foreground">View and manage issued certificates</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
