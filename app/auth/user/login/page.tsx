"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

export default function UserLoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!email || !password) {
        throw new Error("Please fill in all fields")
      }
      await signIn(email, password)
      router.push("/user/events")
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
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center text-white font-bold text-lg">
              US
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Attend Events</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to find and attend events</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>User Sign In</CardTitle>
            <CardDescription>Welcome back. Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="you@example.com"
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
                className="w-full h-10 bg-accent hover:bg-accent/90 text-white font-medium"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 space-y-3 border-t pt-4">
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/user/register" className="font-medium text-accent hover:underline">
                  Create one here
                </Link>
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Are you an admin?{" "}
                <Link href="/auth/admin/login" className="font-medium text-primary hover:underline">
                  Admin login
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
