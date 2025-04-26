"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Shield, X } from "lucide-react"

interface SecurityAlertProps {
  message: string
  onClose: () => void
}

export default function SecurityAlert({ message, onClose }: SecurityAlertProps) {
  return (
    <Alert className="mb-6 bg-destructive/10 border-destructive">
      <Shield className="h-4 w-4 text-destructive" />
      <div className="flex-1">
        <AlertTitle className="text-destructive">Security Alert</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose} className="h-4 w-4 p-0">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </Alert>
  )
}
