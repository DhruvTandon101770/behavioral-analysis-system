"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock audit log data for demonstration
const mockAuditLogs = [
  {
    Timestamp: "2023-04-08T10:30:00Z",
    UserID: "user1",
    Action: "LOGIN",
    TableName: "users",
    RecordID: "1",
    Details: "User login successful",
  },
  {
    Timestamp: "2023-04-08T11:15:00Z",
    UserID: "user1",
    Action: "CREATE",
    TableName: "patients",
    RecordID: "101",
    Details: "New patient record created",
  },
  {
    Timestamp: "2023-04-08T12:00:00Z",
    UserID: "user2",
    Action: "UPDATE",
    TableName: "appointments",
    RecordID: "201",
    Details: "Appointment rescheduled",
  },
  {
    Timestamp: "2023-04-08T12:45:00Z",
    UserID: "user1",
    Action: "READ",
    TableName: "patients",
    RecordID: "102",
    Details: "Patient record accessed",
  },
  {
    Timestamp: "2023-04-08T13:30:00Z",
    UserID: "admin",
    Action: "DELETE",
    TableName: "appointments",
    RecordID: "202",
    Details: "Appointment cancelled",
  },
  {
    Timestamp: "2023-04-08T14:15:00Z",
    UserID: "user2",
    Action: "LOGOUT",
    TableName: "users",
    RecordID: "2",
    Details: "User logout",
  },
]

export default function Audit() {
  const [auditLogs, setAuditLogs] = useState(mockAuditLogs)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Audit Logs</h1>

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
                  {auditLogs.map((log, index) => (
                    <tr
                      key={index}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">{new Date(log.Timestamp).toLocaleString()}</td>
                      <td className="p-4 align-middle">{log.UserID}</td>
                      <td className="p-4 align-middle">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            log.Action === "CREATE"
                              ? "bg-green-100 text-green-800"
                              : log.Action === "UPDATE"
                                ? "bg-blue-100 text-blue-800"
                                : log.Action === "DELETE"
                                  ? "bg-red-100 text-red-800"
                                  : log.Action === "LOGIN" || log.Action === "LOGOUT"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {log.Action}
                        </span>
                      </td>
                      <td className="p-4 align-middle">{log.TableName}</td>
                      <td className="p-4 align-middle">{log.RecordID}</td>
                      <td className="p-4 align-middle">{log.Details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
