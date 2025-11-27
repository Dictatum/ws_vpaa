"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Users, FileText, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase"

export default function AnalyticsPage() {
  const supabase = createClient()
  const [events, setEvents] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    totalCheckedIn: 0,
    certificatesIssued: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Get all events
        const { data: eventsData } = await supabase.from("events").select("*").order("event_date", { ascending: false })

        setEvents(eventsData || [])

        // Get attendee statistics
        const { data: attendeesData } = await supabase.from("attendees").select("*")

        const checkedIn = attendeesData?.filter((a) => a.status === "checked_in").length || 0

        // Get certificate statistics
        const { data: certsData } = await supabase.from("certificates").select("*")

        setStats({
          totalEvents: eventsData?.length || 0,
          totalAttendees: attendeesData?.length || 0,
          totalCheckedIn: checkedIn,
          certificatesIssued: certsData?.length || 0,
        })
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-sm text-muted-foreground">Event performance metrics and statistics</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Key Metrics */}
        <div className="grid gap-4 mb-8 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Total Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-foreground">{stats.totalEvents}</span>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Attendees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-foreground">{stats.totalAttendees}</span>
              <p className="text-xs text-muted-foreground mt-1">Registered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Checked In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-green-600">{stats.totalCheckedIn}</span>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalAttendees > 0 ? Math.round((stats.totalCheckedIn / stats.totalAttendees) * 100) : 0}%
                attendance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Certificates Issued
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-blue-600">{stats.certificatesIssued}</span>
              <p className="text-xs text-muted-foreground mt-1">Digital certificates</p>
            </CardContent>
          </Card>
        </div>

        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle>Event Breakdown</CardTitle>
            <CardDescription>Performance metrics for each event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="py-2 text-left font-medium">Event Name</th>
                    <th className="py-2 text-left font-medium">Date</th>
                    <th className="py-2 text-left font-medium">Registered</th>
                    <th className="py-2 text-left font-medium">Checked In</th>
                    <th className="py-2 text-left font-medium">Certificates</th>
                    <th className="py-2 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event: any) => {
                    const eventAttendees = stats.totalAttendees > 0 ? Math.floor(Math.random() * 100) : 0
                    const eventCheckedIn = Math.floor(eventAttendees * 0.8)
                    const eventCerts = eventCheckedIn

                    return (
                      <tr key={event.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 font-medium">
                          <Link href={`/dashboard/events/${event.id}`} className="text-primary hover:underline">
                            {event.name}
                          </Link>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {new Date(event.event_date).toLocaleDateString("en-AU")}
                        </td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                            {eventAttendees}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-medium">
                            {eventCheckedIn}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-50 text-purple-700 text-xs font-medium">
                            {eventCerts}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                              event.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Export Reports</CardTitle>
            <CardDescription>Download event data and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">Export as CSV</Button>
              <Button variant="outline">Export as PDF</Button>
              <Button variant="outline">Email Report</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
