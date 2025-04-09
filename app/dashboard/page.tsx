"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Mock anomaly data for demonstration
const mockAnomalies = [
  { timestamp: "2023-04-08T10:30:00Z", is_anomaly: 1 },
  { timestamp: "2023-04-08T11:15:00Z", is_anomaly: 0 },
  { timestamp: "2023-04-08T12:00:00Z", is_anomaly: 1 },
  { timestamp: "2023-04-08T12:45:00Z", is_anomaly: 0 },
  { timestamp: "2023-04-08T13:30:00Z", is_anomaly: 0 },
  { timestamp: "2023-04-08T14:15:00Z", is_anomaly: 1 },
]

export default function Dashboard() {
  const [anomalies, setAnomalies] = useState(mockAnomalies)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API fetch
    const fetchAnomalies = async () => {
      try {
        // In a real app, this would be an actual API call
        // const response = await fetch("/api/anomalies")
        // if (!response.ok) throw new Error("Failed to fetch anomalies")
        // const data = await response.json()
        // setAnomalies(data)

        // Using mock data for demonstration
        setAnomalies(mockAnomalies)
      } catch (err: any) {
        console.error("Error fetching anomalies:", err)
        setError("Failed to load anomalies.")
      } finally {
        setLoading(false)
      }
    }

    fetchAnomalies()

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newAnomaly = {
        timestamp: new Date().toISOString(),
        is_anomaly: Math.random() > 0.7 ? 1 : 0,
      }

      setAnomalies((prev) => [...prev, newAnomaly])

      if (newAnomaly.is_anomaly === 1) {
        alert("New anomaly detected!")
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Real-Time Anomaly Monitoring</h1>

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
            <CardHeader>
              <CardTitle>Anomaly Statistics</CardTitle>
              <CardDescription>Overview of detected anomalies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Events:</span>
                  <span className="font-medium">{anomalies.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Anomalies:</span>
                  <span className="font-medium">{anomalies.filter((a) => a.is_anomaly === 1).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Normal Events:</span>
                  <span className="font-medium">{anomalies.filter((a) => a.is_anomaly === 0).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Anomaly Rate:</span>
                  <span className="font-medium">
                    {((anomalies.filter((a) => a.is_anomaly === 1).length / anomalies.length) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
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
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {anomalies
                      .slice(-10)
                      .reverse()
                      .map((anomaly, index) => (
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
                        </tr>
                      ))}
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
