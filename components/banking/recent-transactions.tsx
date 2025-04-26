import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownLeft, CreditCard, ShoppingBag, Coffee, Home } from "lucide-react"

export default function RecentTransactions() {
  const transactions = [
    {
      id: 1,
      description: "Amazon.com",
      category: "Shopping",
      date: "2023-04-12",
      amount: -84.29,
      icon: ShoppingBag,
    },
    {
      id: 2,
      description: "Salary Deposit",
      category: "Income",
      date: "2023-04-10",
      amount: 2750.0,
      icon: ArrowDownLeft,
    },
    {
      id: 3,
      description: "Starbucks",
      category: "Food & Drink",
      date: "2023-04-09",
      amount: -5.67,
      icon: Coffee,
    },
    {
      id: 4,
      description: "Rent Payment",
      category: "Housing",
      date: "2023-04-05",
      amount: -1200.0,
      icon: Home,
    },
    {
      id: 5,
      description: "Netflix Subscription",
      category: "Entertainment",
      date: "2023-04-03",
      amount: -14.99,
      icon: CreditCard,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest account activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center">
              <div className="mr-4 rounded-full p-2 bg-muted">
                <transaction.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">{transaction.category}</p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
              <div className={`text-right ${transaction.amount < 0 ? "" : "text-green-600"}`}>
                <p className="text-sm font-medium">
                  {transaction.amount < 0 ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
