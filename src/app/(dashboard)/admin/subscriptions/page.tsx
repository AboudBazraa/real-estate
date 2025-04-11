"use client";
import { Button } from "@/shared//components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Check,
  Plus,
  Sparkles,
  CreditCard,
  Loader2,
  RefreshCw,
  Star,
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import * as React from "react";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};

const plans = [
  {
    name: "Basic",
    price: 29,
    interval: "month",
    description: "Perfect for small agencies",
    features: [
      "Up to 50 property listings",
      "2 agent accounts",
      "Basic analytics",
      "Email support",
    ],
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
];

export default function SubscriptionsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState("Professional");

  React.useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleSelectPlan = (planName) => {
    setSelectedPlan(planName);
  };

  return (
    <motion.div
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div
        variants={item}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Subscription Plans
          </h1>
          <p className="text-muted-foreground">
            Choose the right plan for your business
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Custom Plan
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Contact sales for a custom plan</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="plans-loading"
            className="grid gap-6 md:grid-cols-3"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div key={i} variants={item}>
                <Card className="h-full">
                  <CardHeader>
                    <Skeleton className="h-7 w-24 mb-2" />
                    <div className="flex items-baseline mb-2">
                      <Skeleton className="h-8 w-16 mr-1" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="flex items-center">
                          <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="plans-loaded"
            className="grid gap-6 md:grid-cols-3"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
          >
            {plans.map((plan) => (
              <motion.div key={plan.name} variants={item} layout>
                <Card
                  className={`h-full relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    plan.current
                      ? "border-primary border-2"
                      : plan.popular
                      ? "border-primary/50"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -right-12 top-5 transform rotate-45 bg-primary text-primary-foreground px-10 py-1 text-xs font-medium">
                      Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        {plan.name}
                        {plan.current && (
                          <Badge className="ml-2 bg-primary/20 text-primary border-primary">
                            Current
                          </Badge>
                        )}
                      </span>
                      {plan.popular && (
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      )}
                    </CardTitle>
                    <div className="flex items-baseline mt-2">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground ml-1">
                        /{plan.interval}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <motion.li
                          key={feature}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full gap-2"
                      variant={plan.current ? "outline" : "default"}
                      disabled={plan.current}
                      onClick={() => handleSelectPlan(plan.name)}
                    >
                      {plan.current ? (
                        <>
                          <CreditCard className="h-4 w-4" />
                          Current Plan
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Upgrade Plan
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={fadeIn}
        className="mt-12 p-6 rounded-lg border bg-muted/50"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="mr-4 p-2 bg-primary/20 text-primary rounded-full">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Need a custom plan?</h3>
              <p className="text-muted-foreground">
                Contact our sales team for a customized solution that fits your
                specific requirements.
              </p>
            </div>
          </div>
          <Button className="shrink-0">Contact Sales</Button>
        </div>
      </motion.div>

      {/* Refreshing indicator */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            className="fixed bottom-6 right-6 bg-background/90 backdrop-blur-sm text-foreground px-4 py-3 shadow-lg flex items-center space-x-3 z-50 rounded-lg border"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-medium">Refreshing data...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
