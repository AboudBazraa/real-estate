"use client"
import { Button } from "@/shared//components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Check, Plus } from "lucide-react"

const plans = [
  {
    name: "Basic",
    price: 29,
    interval: "month",
    description: "Perfect for small agencies",
    features: ["Up to 50 property listings", "2 agent accounts", "Basic analytics", "Email support"],
    current: false,
  },
  {
    name: "Professional",
    price: 99,
    interval: "month",
    description: "For growing real estate businesses",
    features: [
      "Up to 200 property listings",
      "10 agent accounts",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
    ],
    current: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: 299,
    interval: "month",
    description: "For large agencies and brokers",
    features: [
      "Unlimited property listings",
      "Unlimited agent accounts",
      "Custom analytics",
      "24/7 phone support",
      "Custom branding",
      "API access",
    ],
    current: false,
  },
]

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-muted-foreground">Choose the right plan for your business</p>
        </div>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Custom Plan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.popular ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {plan.popular && <Badge variant="secondary">Popular</Badge>}
              </CardTitle>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.interval}</span>
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.current ? "outline" : "default"}>
                {plan.current ? "Current Plan" : "Upgrade Plan"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

