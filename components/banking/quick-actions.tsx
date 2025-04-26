import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRightLeft, CreditCard, PiggyBank, FileText } from "lucide-react"
import Link from "next/link"

export default function QuickActions() {
  const actions = [
    {
      name: "Transfer Money",
      description: "Move funds between accounts",
      icon: ArrowRightLeft,
      href: "/banking/transfers",
    },
    {
      name: "Pay Bills",
      description: "Schedule or make payments",
      icon: FileText,
      href: "/banking/bills",
    },
    {
      name: "Deposit Funds",
      description: "Add money to your account",
      icon: PiggyBank,
      href: "/banking/deposit",
    },
    {
      name: "Manage Cards",
      description: "View and control your cards",
      icon: CreditCard,
      href: "/banking/cards",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common banking tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {actions.map((action) => (
            <Button key={action.name} variant="outline" className="justify-start h-auto py-3" asChild>
              <Link href={action.href}>
                <action.icon className="mr-2 h-4 w-4" />
                <div className="text-left">
                  <p className="font-medium">{action.name}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
