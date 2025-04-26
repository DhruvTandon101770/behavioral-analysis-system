"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function AuthDebug() {
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    // Only run on client
    setUsername(localStorage.getItem("username"))
    setToken(localStorage.getItem("token"))
  }, [])

  const handleClearAuth = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("token")

    // Clear the auth cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    window.location.reload()
  }

  const handleGoToLogin = () => {
    router.push("/login")
  }

  const handleGoToBanking = () => {
    router.push("/banking")
  }

  if (!expanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setExpanded(true)} className="bg-background shadow-md">
          Auth Debug
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm">Authentication Debug</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setExpanded(false)}>
              Close
            </Button>
          </div>
          <CardDescription>Check your authentication status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Admin Credentials</AlertTitle>
            <AlertDescription>
              Username: admin
              <br />
              Password: admin123
            </AlertDescription>
          </Alert>

          <div>
            <p className="font-medium">Username:</p>
            <p className="bg-muted p-1 rounded">{username || "Not logged in"}</p>
          </div>
          <div>
            <p className="font-medium">Token:</p>
            <p className="bg-muted p-1 rounded overflow-hidden text-ellipsis">
              {token ? `${token.substring(0, 20)}...` : "No token"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="destructive" onClick={handleClearAuth}>
              Clear Auth
            </Button>
            <Button size="sm" onClick={handleGoToLogin}>
              Go to Login
            </Button>
            <Button size="sm" onClick={handleGoToBanking}>
              Go to Banking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
