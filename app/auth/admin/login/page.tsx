"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

const DEMO_EMAIL = "vpaa-admin@gmail.com"
const DEMO_PASSWORD = "vpaaadmin123"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, role } = useAuth()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const confirmed = searchParams.get("confirmed")
    if (confirmed === "true") {
      setSuccess("Email confirmed successfully! You can now sign in.")
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (!email || !password) {
        throw new Error("Please fill in all fields")
      }
      await signIn(email, password)

      if (role !== "admin") {
        throw new Error("Admin access required. Please use the user login.")
      }

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-lg">
              AD
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Admin Portal</h1>
          <p className="mt-2 text-sm text-muted-foreground">Event Management & Administration</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Admin Sign In</CardTitle>
            <CardDescription>Enter your admin credentials to manage events</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Demo credentials hint */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-700">
                <strong>Demo Credentials:</strong>
              </p>
              <p className="text-xs text-blue-700 font-mono">Email: vpaa-admin@gmail.com</p>
              <p className="text-xs text-blue-700 font-mono">Pass: vpaaadmin123</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-10"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-medium"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 space-y-3 border-t pt-4">
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/admin/register" className="font-medium text-primary hover:underline">
                  Register as admin
                </Link>
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Not an admin?{" "}
                <Link href="/auth/user/login" className="font-medium text-primary hover:underline">
                  User login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}
