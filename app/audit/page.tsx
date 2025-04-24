"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Audit() {
  const router = useRouter()
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const username = localStorage.getItem("username")
    const token = localStorage.getItem("token")

    if (!username || !token) {
      router.push("/login")
      return
    }

    setIsAuthenticated(true)

    // Fetch audit logs from the backend
    const fetchAuditLogs = async () => {
      try {
        const response = await fetch("/api/audit-logs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch audit logs")
        }

        const data = await response.json()
        setAuditLogs(data)
      } catch (err: any) {
        console.error("Error fetching audit logs:", err)
        setError(err.message || "Failed to load audit logs.")
      } finally {
        setLoading(false)
      }
    }

    fetchAuditLogs()
  }, [router])

  if (!isAuthenticated) {
    return null // Don't render anything while checking authentication
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Audit Logs</h1>

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
        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>Comprehensive log of all system actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b bg-muted/50">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium">Timestamp</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">User ID</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Action</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Table</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Record ID</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {auditLogs.length > 0 ? (
                      auditLogs.map((log: any, index) => (
                        <tr
                          key={index}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="p-4 align-middle">{log.user_id}</td>
                          <td className="p-4 align-middle">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                log.action === "CREATE"
                                  ? "bg-green-100 text-green-800"
                                  : log.action === "UPDATE"
                                    ? "bg-blue-100 text-blue-800"
                                    : log.action === "DELETE"
                                      ? "bg-red-100 text-red-800"
                                      : log.action === "LOGIN" || log.action === "LOGOUT"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td className="p-4 align-middle">{log.table_name}</td>
                          <td className="p-4 align-middle">{log.record_id}</td>
                          <td className="p-4 align-middle">{log.details}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                          No audit logs found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
