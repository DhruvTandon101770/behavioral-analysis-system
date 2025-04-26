"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import BankingLayout from "@/components/banking/layout"
import { trackUserNavigation } from "@/lib/banking-security"

export default function SettingsPage() {
  useEffect(() => {
    // Track this page visit
    trackUserNavigation("settings")
  }, [])

  return (
    <BankingLayout>
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require a verification code when logging in</p>
              </div>
              <Switch id="two-factor" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="login-alerts">Login Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive notifications for new login attempts</p>
              </div>
              <Switch id="login-alerts" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="transaction-alerts">Transaction Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified for transactions above $500</p>
              </div>
              <Switch id="transaction-alerts" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="behavioral-security">Behavioral Security</Label>
                <p className="text-sm text-muted-foreground">Monitor account for unusual activity patterns</p>
              </div>
              <Switch id="behavioral-security" defaultChecked />
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-2">Device Management</h3>
            <p className="text-sm text-muted-foreground mb-4">Manage devices that have access to your account</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Device</p>
                  <p className="text-sm text-muted-foreground">Windows PC • Chrome • Last active now</p>
                </div>
                <Button variant="outline" size="sm">
                  This Device
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">iPhone 13</p>
                  <p className="text-sm text-muted-foreground">iOS • Safari • Last active 2 days ago</p>
                </div>
                <Button variant="outline" size="sm">
                  Remove
                </Button>
              </div>
            </div>
          </div>

          <Button className="w-full">Save Settings</Button>
        </CardContent>
      </Card>
    </BankingLayout>
  )
}
