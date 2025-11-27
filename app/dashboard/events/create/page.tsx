"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"

export default function CreateEventPage() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    maxAttendees: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Get or create organization for user
      let { data: orgData } = await supabase.from("organizations").select("id").limit(1).single()

      if (!orgData) {
        const { data: newOrg } = await supabase
          .from("organizations")
          .insert([{ name: "VPAA" }])
          .select()
          .single()
        orgData = newOrg
      }

      const { data, error: insertError } = await supabase
        .from("events")
        .insert([
          {
            name: formData.name,
            description: formData.description,
            organization_id: orgData.id,
            event_date: formData.eventDate,
            start_time: formData.startTime,
            end_time: formData.endTime,
            location: formData.location,
            max_attendees: formData.maxAttendees ? Number.parseInt(formData.maxAttendees) : null,
            status: "active",
          },
        ])
        .select()
        .single()

      if (insertError) {
        setError(insertError.message)
        return
      }

      router.push(`/dashboard/events/${data.id}`)
    } catch (err: any) {
      setError(err.message || "Failed to create event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
            <CardDescription>Fill in the details for your event</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="VPAA Annual Conference 2025"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Event description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Sydney Convention Centre"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <Input
                    id="maxAttendees"
                    name="maxAttendees"
                    type="number"
                    placeholder="500"
                    value={formData.maxAttendees}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                  {loading ? "Creating..." : "Create Event"}
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline">Cancel</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
