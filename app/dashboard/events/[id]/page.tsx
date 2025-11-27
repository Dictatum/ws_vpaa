"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, QrCode, FileText, Users, Download } from "lucide-react"
import { createClient } from "@/lib/supabase"

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [event, setEvent] = useState<any>(null)
  const [attendees, setAttendees] = useState([])
  const [loading, setLoading] = useState(true)
  const [newAttendee, setNewAttendee] = useState({ firstName: "", lastName: "", email: "" })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data: eventData } = await supabase.from("events").select("*").eq("id", params.id).single()

        setEvent(eventData)

        const { data: attendeesData } = await supabase
          .from("attendees")
          .select("*")
          .eq("event_id", params.id)
          .order("first_name")

        setAttendees(attendeesData || [])
      } catch (error) {
        console.error("Error fetching event:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id, supabase])

  const handleAddAttendee = async () => {
    if (!newAttendee.firstName || !newAttendee.lastName) return

    try {
      const { data, error } = await supabase
        .from("attendees")
        .insert([
          {
            event_id: params.id,
            first_name: newAttendee.firstName,
            last_name: newAttendee.lastName,
            email: newAttendee.email || null,
            status: "registered",
          },
        ])
        .select()
        .single()

      if (error) throw error

      setAttendees([...attendees, data])
      setNewAttendee({ firstName: "", lastName: "", email: "" })
    } catch (error) {
      console.error("Error adding attendee:", error)
    }
  }

  const handleCheckIn = async (attendeeId: string) => {
    try {
      const { error } = await supabase
        .from("attendees")
        .update({
          status: "checked_in",
          check_in_time: new Date().toISOString(),
        })
        .eq("id", attendeeId)

      if (error) throw error

      setAttendees(
        attendees.map((a) =>
          a.id === attendeeId ? { ...a, status: "checked_in", check_in_time: new Date().toISOString() } : a,
        ),
      )
    } catch (error) {
      console.error("Error checking in:", error)
    }
  }

  const handleIssueCertificate = async (attendeeId: string) => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .insert([
          {
            attendee_id: attendeeId,
            event_id: params.id,
            certificate_number: `VPAA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            issued_date: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error

      setAttendees(
        attendees.map((a) =>
          a.id === attendeeId
            ? { ...a, certificate_issued: true, certificate_issue_date: new Date().toISOString() }
            : a,
        ),
      )
    } catch (error) {
      console.error("Error issuing certificate:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Event not found</p>
            </CardContent>
          </Card>
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
          <h1 className="text-2xl font-bold text-foreground">{event.name}</h1>
          <p className="text-sm text-muted-foreground">{event.event_date}</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="attendees" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendees" className="gap-2">
              <Users className="h-4 w-4" />
              Attendees
            </TabsTrigger>
            <TabsTrigger value="checkin" className="gap-2">
              <QrCode className="h-4 w-4" />
              Check-In
            </TabsTrigger>
            <TabsTrigger value="certificates" className="gap-2">
              <FileText className="h-4 w-4" />
              Certificates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Attendee</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <Label htmlFor="firstName" className="text-xs">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={newAttendee.firstName}
                      onChange={(e) => setNewAttendee({ ...newAttendee, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-xs">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={newAttendee.lastName}
                      onChange={(e) => setNewAttendee({ ...newAttendee, lastName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={newAttendee.email}
                      onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddAttendee} className="w-full bg-primary hover:bg-primary/90">
                      Add Attendee
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendees List</CardTitle>
                <CardDescription>{attendees.length} registered</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="py-2 text-left font-medium">Name</th>
                        <th className="py-2 text-left font-medium">Email</th>
                        <th className="py-2 text-left font-medium">Status</th>
                        <th className="py-2 text-left font-medium">Check-In</th>
                        <th className="py-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendees.map((attendee: any) => (
                        <tr key={attendee.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3">
                            {attendee.first_name} {attendee.last_name}
                          </td>
                          <td className="py-3 text-muted-foreground">{attendee.email}</td>
                          <td className="py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                                attendee.status === "checked_in"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {attendee.status === "checked_in" ? "✓" : "○"} {attendee.status}
                            </span>
                          </td>
                          <td className="py-3">
                            {attendee.check_in_time && new Date(attendee.check_in_time).toLocaleTimeString()}
                          </td>
                          <td className="py-3">
                            {attendee.status === "registered" && (
                              <Button size="sm" variant="outline" onClick={() => handleCheckIn(attendee.id)}>
                                Check In
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checkin">
            <Card>
              <CardHeader>
                <CardTitle>Check-In Management</CardTitle>
                <CardDescription>Use the dedicated check-in interface</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/dashboard/events/${params.id}/check-in`}>
                  <Button className="bg-primary hover:bg-primary/90 gap-2">
                    <QrCode className="h-4 w-4" />
                    Open Check-In Interface
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>Certificate Management</CardTitle>
                <CardDescription>Generate and distribute certificates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {attendees.filter((a: any) => a.status === "checked_in").length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
                      <p className="text-center text-muted-foreground">
                        Check in attendees first to issue certificates
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="border-b border-border">
                        <tr>
                          <th className="py-2 text-left font-medium">Attendee</th>
                          <th className="py-2 text-left font-medium">Status</th>
                          <th className="py-2 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendees
                          .filter((a: any) => a.status === "checked_in")
                          .map((attendee: any) => (
                            <tr key={attendee.id} className="border-b border-border">
                              <td className="py-3">
                                {attendee.first_name} {attendee.last_name}
                              </td>
                              <td className="py-3">
                                {attendee.certificate_issued ? (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Issued</span>
                                ) : (
                                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="py-3">
                                {!attendee.certificate_issued && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleIssueCertificate(attendee.id)}
                                  >
                                    Issue Certificate
                                  </Button>
                                )}
                                {attendee.certificate_issued && (
                                  <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                                    <Download className="h-4 w-4" />
                                    Download
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
