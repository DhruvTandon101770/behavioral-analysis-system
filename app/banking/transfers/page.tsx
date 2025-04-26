"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BankingLayout from "@/components/banking/layout"
import { trackUserNavigation } from "@/lib/banking-security"

export default function TransfersPage() {
  const [amount, setAmount] = useState("")
  const [fromAccount, setFromAccount] = useState("")
  const [toAccount, setToAccount] = useState("")

  useEffect(() => {
    // Track this page visit
    trackUserNavigation("transfers")
  }, [])

  return (
    <BankingLayout>
      <Card>
        <CardHeader>
          <CardTitle>Transfer Money</CardTitle>
          <CardDescription>Move funds between your accounts or send to someone else</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-account">From Account</Label>
                  <Select value={fromAccount} onValueChange={setFromAccount}>
                    <SelectTrigger id="from-account">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking Account (****4567)</SelectItem>
                      <SelectItem value="savings">Savings Account (****7890)</SelectItem>
                      <SelectItem value="credit">Credit Card (****1234)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to-account">To Account</Label>
                  <Select value={toAccount} onValueChange={setToAccount}>
                    <SelectTrigger id="to-account">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking Account (****4567)</SelectItem>
                      <SelectItem value="savings">Savings Account (****7890)</SelectItem>
                      <SelectItem value="external">External Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input id="description" placeholder="Enter a description for this transfer" />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Transfer Funds
            </Button>
          </form>
        </CardContent>
      </Card>
    </BankingLayout>
  )
}
