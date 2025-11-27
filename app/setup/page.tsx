"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader } from "lucide-react"

export default function SetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [success, router])

  const handleCreateAdmin = async () => {
    setLoading(true)
    setMessage("")
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/setup/create-admin", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create admin user")
        return
      }

      setMessage(data.message)
      setSuccess(true)
      console.log("[v0] Setup complete:", data)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>VPAA System Setup</CardTitle>
            <CardDescription>Initialize admin user for event management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-semibold text-blue-900 mb-2">Admin Credentials</h3>
              <p className="text-sm text-blue-800 font-mono">Email: vpaa-admin@gmail.com</p>
              <p className="text-sm text-blue-800 font-mono">Password: vpaaadmin123</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {message}
                  <p className="text-xs mt-2">Redirecting to dashboard...</p>
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleCreateAdmin}
              disabled={loading || success}
              className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-medium"
            >
              {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {success ? "Admin Created!" : loading ? "Creating..." : "Create Admin User"}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              After creation, you will be automatically redirected to the admin dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
