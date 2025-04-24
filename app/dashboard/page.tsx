"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Activity, MousePointer, Keyboard } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  const [anomalies, setAnomalies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [behavioralStats, setBehavioralStats] = useState({
    typingSpeed: 0,
    mouseMovements: 0,
    clickCount: 0,
    anomalyRate: 0,
  })

  useEffect(() => {
    // Check if user is logged in
    const username = localStorage.getItem("username")
    const token = localStorage.getItem("token")

    if (!username || !token) {
      router.push("/login")
      return
    }

    setIsAuthenticated(true)

    // Fetch anomalies from the backend
    const fetchAnomalies = async () => {
      try {
        const response = await fetch("/api/anomalies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch anomalies")
        }

        const data = await response.json()
        console.log("Fetched anomalies:", data)
        setAnomalies(data)

        // Calculate stats
        if (data.length > 0) {
          const anomalyCount = data.filter((a: any) => a.is_anomaly === 1).length
          setBehavioralStats({
            typingSpeed: Math.floor(Math.random() * 60) + 40, // Mock data
            mouseMovements: Math.floor(Math.random() * 500) + 200, // Mock data
            clickCount: Math.floor(Math.random() * 50) + 10, // Mock data
            anomalyRate: (anomalyCount / data.length) * 100,
          })
        }
      } catch (err: any) {
        console.error("Error fetching anomalies:", err)
        setError(err.message || "Failed to load anomalies.")
      } finally {
        setLoading(false)
      }
    }

    fetchAnomalies()
  }, [router])

  if (!isAuthenticated) {
    return null // Don't render anything while checking authentication
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Behavioral Analysis Dashboard</h1>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Typing Behavior</CardTitle>
              <Keyboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{behavioralStats.typingSpeed} WPM</div>
              <p className="text-xs text-muted-foreground">Average typing speed</p>
              <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded">
                <div
                  className="h-1 bg-primary"
                  style={{ width: `${Math.min((behavioralStats.typingSpeed / 100) * 100, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mouse Behavior</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{behavioralStats.mouseMovements}</div>
              <p className="text-xs text-muted-foreground">Mouse movements tracked</p>
              <div className="mt-2 text-sm">
                <span className="font-medium">{behavioralStats.clickCount}</span> clicks recorded
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anomaly Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{behavioralStats.anomalyRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {behavioralStats.anomalyRate < 5
                  ? "Normal behavior pattern"
                  : behavioralStats.anomalyRate < 20
                    ? "Some unusual patterns detected"
                    : "Significant anomalies detected"}
              </p>
              <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded">
                <div
                  className={`h-1 ${
                    behavioralStats.anomalyRate < 5
                      ? "bg-green-500"
                      : behavioralStats.anomalyRate < 20
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(behavioralStats.anomalyRate, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Anomalies</CardTitle>
              <CardDescription>Latest detected anomalies in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium">Timestamp</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Confidence</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {anomalies.length > 0 ? (
                      anomalies
                        .slice(-10)
                        .reverse()
                        .map((anomaly: any, index) => (
                          <tr
                            key={index}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle">{new Date(anomaly.timestamp).toLocaleString()}</td>
                            <td className="p-4 align-middle">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  anomaly.is_anomaly === 1
                                    ? "bg-destructive/10 text-destructive"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {anomaly.is_anomaly === 1 ? "Anomaly" : "Normal"}
                              </span>
                            </td>
                            <td className="p-4 align-middle">
                              {anomaly.confidence_score ? (
                                <div className="flex items-center">
                                  <span className="mr-2">{(anomaly.confidence_score * 100).toFixed(0)}%</span>
                                  <div className="h-1.5 w-16 bg-muted overflow-hidden rounded">
                                    <div
                                      className={`h-1.5 ${anomaly.is_anomaly === 1 ? "bg-red-500" : "bg-green-500"}`}
                                      style={{ width: `${anomaly.confidence_score * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td className="p-4 align-middle">{anomaly.details || "No details available"}</td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-muted-foreground">
                          No anomalies detected yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
