"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Eye, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { generateCertificateSVG, downloadCertificate } from "@/lib/certificate-generator"

export default function CertificatesPage() {
  const params = useParams()
  const supabase = createClient()
  const [event, setEvent] = useState<any>(null)
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [previewCert, setPreviewCert] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: eventData } = await supabase.from("events").select("*").eq("id", params.id).single()

        setEvent(eventData)

        // Get certificates with attendee details
        const { data: certsData } = await supabase
          .from("certificates")
          .select(`
            *,
            attendees (
              first_name,
              last_name,
              email
            )
          `)
          .eq("event_id", params.id)
          .order("issued_date", { ascending: false })

        setCertificates(certsData || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, supabase])

  const handleDownload = (certificate: any) => {
    const attendeeName = `${certificate.attendees.first_name} ${certificate.attendees.last_name}`
    const svgContent = generateCertificateSVG(
      attendeeName,
      event.name,
      certificate.issued_date,
      certificate.certificate_number,
    )
    downloadCertificate(svgContent, `${certificate.certificate_number}.svg`)
  }

  if (loading) {
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
          <Link
            href={`/dashboard/events/${params.id}`}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Event
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{event?.name}</h1>
          <p className="text-sm text-muted-foreground">Certificate Management</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="issued" className="space-y-4">
          <TabsList>
            <TabsTrigger value="issued" className="gap-2">
              <FileText className="h-4 w-4" />
              Issued ({certificates.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="issued" className="space-y-4">
            {certificates.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No certificates issued yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {previewCert && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Certificate Preview</CardTitle>
                      <CardDescription>
                        {previewCert.attendees.first_name} {previewCert.attendees.last_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white rounded-lg border border-border p-4 overflow-x-auto">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: generateCertificateSVG(
                              `${previewCert.attendees.first_name} ${previewCert.attendees.last_name}`,
                              event.name,
                              previewCert.issued_date,
                              previewCert.certificate_number,
                            ),
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Certificates</CardTitle>
                    <CardDescription>Download or preview certificates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b border-border">
                          <tr>
                            <th className="py-2 text-left font-medium">Attendee</th>
                            <th className="py-2 text-left font-medium">Certificate #</th>
                            <th className="py-2 text-left font-medium">Issued Date</th>
                            <th className="py-2 text-left font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {certificates.map((cert: any) => (
                            <tr key={cert.id} className="border-b border-border hover:bg-muted/50">
                              <td className="py-3">
                                {cert.attendees.first_name} {cert.attendees.last_name}
                              </td>
                              <td className="py-3 font-mono text-xs text-muted-foreground">
                                {cert.certificate_number}
                              </td>
                              <td className="py-3">{new Date(cert.issued_date).toLocaleDateString("en-AU")}</td>
                              <td className="py-3 flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setPreviewCert(cert)}
                                  className="gap-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  Preview
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownload(cert)}
                                  className="gap-1"
                                >
                                  <Download className="h-4 w-4" />
                                  Download
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
