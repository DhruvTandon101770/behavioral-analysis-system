import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AccountOverview() {
  const accounts = [
    {
      id: "checking",
      name: "Checking Account",
      number: "****4567",
      balance: 2543.87,
      available: 2543.87,
    },
    {
      id: "savings",
      name: "Savings Account",
      number: "****7890",
      balance: 12750.42,
      available: 12750.42,
    },
    {
      id: "credit",
      name: "Credit Card",
      number: "****1234",
      balance: -450.25,
      available: 4549.75,
      limit: 5000,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Overview</CardTitle>
        <CardDescription>View and manage your accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="checking">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="checking">Checking</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="credit">Credit Card</TabsTrigger>
          </TabsList>

          {accounts.map((account) => (
            <TabsContent key={account.id} value={account.id} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                  <p className="text-2xl font-bold">{account.number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">
                    {account.id === "credit" ? "Current Balance" : "Available Balance"}
                  </p>
                  <p
                    className={`text-2xl font-bold ${account.id === "credit" && account.balance < 0 ? "text-destructive" : ""}`}
                  >
                    ${Math.abs(account.balance).toFixed(2)}
                  </p>
                  {account.id === "credit" && (
                    <p className="text-sm text-muted-foreground">Available Credit: ${account.available.toFixed(2)}</p>
                  )}
                </div>
              </div>

              <div className="h-2 bg-muted rounded-full overflow-hidden">
                {account.id === "credit" ? (
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(Math.abs(account.balance) / account.limit!) * 100}%` }}
                  />
                ) : (
                  <div className="h-full bg-primary" style={{ width: "100%" }} />
                )}
              </div>

              {account.id === "credit" && (
                <p className="text-xs text-muted-foreground text-right">Credit Limit: ${account.limit!.toFixed(2)}</p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
