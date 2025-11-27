"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Search, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase"

export default function CheckInPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [event, setEvent] = useState<any>(null)
  const [attendees, setAttendees] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [checkInMessage, setCheckInMessage] = useState("")
  const [checkedInCount, setCheckedInCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: eventData } = await supabase.from("events").select("*").eq("id", params.id).single()

        setEvent(eventData)

        const { data: attendeesData } = await supabase
          .from("attendees")
          .select("*")
          .eq("event_id", params.id)
          .order("first_name")

        setAttendees(attendeesData || [])
        const checked = attendeesData?.filter((a) => a.status === "checked_in").length || 0
        setCheckedInCount(checked)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, supabase])

  const handleCheckIn = async (attendeeId: string, firstName: string) => {
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
      setCheckedInCount((prev) => prev + 1)
      setCheckInMessage(`${firstName} checked in successfully!`)
      setTimeout(() => setCheckInMessage(""), 3000)
      setSearchTerm("")
    } catch (error) {
      console.error("Check-in error:", error)
      setCheckInMessage("Check-in failed. Please try again.")
    }
  }

  const filteredAttendees = attendees.filter(
    (a) =>
      `${a.first_name} ${a.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.email && a.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const registeredAttendees = filteredAttendees.filter((a) => a.status === "registered")
  const checkedInAttendees = filteredAttendees.filter((a) => a.status === "checked_in")

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href={`/dashboard/events/${params.id}`}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Event
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{event?.name}</h1>
          <p className="text-sm text-muted-foreground">Check-In Management</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 mb-8 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Attendees</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-foreground">{attendees.length}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Checked In</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-600">{checkedInCount}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-yellow-600">{attendees.length - checkedInCount}</span>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Check In</CardTitle>
            <CardDescription>Find attendee by name or email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {checkInMessage && (
              <Alert className={checkInMessage.includes("successfully") ? "bg-green-50" : "bg-red-50"}>
                <Check className="h-4 w-4" />
                <AlertDescription>{checkInMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="search">Search Attendees</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {registeredAttendees.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <h3 className="text-sm font-semibold text-foreground">Not Checked In ({registeredAttendees.length})</h3>
                <div className="space-y-2">
                  {registeredAttendees.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {attendee.first_name} {attendee.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{attendee.email}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleCheckIn(attendee.id, attendee.first_name)}
                        className="bg-primary hover:bg-primary/90 gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Check In
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {checkedInAttendees.length > 0 && (
              <div className="space-y-2 mt-6">
                <h3 className="text-sm font-semibold text-foreground">
                  Already Checked In ({checkedInAttendees.length})
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {checkedInAttendees.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {attendee.first_name} {attendee.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {attendee.check_in_time && new Date(attendee.check_in_time).toLocaleTimeString()}
                        </p>
                      </div>
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
