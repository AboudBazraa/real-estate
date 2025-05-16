"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, X, CreditCard, BadgeCheck, Shield } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/shared/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/hooks/use-toast";
import { useSupabase } from "@/shared/providers/SupabaseProvider";
import { Badge } from "@/shared/components/ui/badge";

export default function SubscriptionSection() {
  const { user, supabase } = useSupabase();
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  // Fetch user's subscription status and role
  useEffect(() => {
    if (user) {
      fetchSubscription();
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    // Default to USER role to avoid undefined
    setUserRole("USER");

    try {
      // Validate prerequisites
      if (!user?.id || !supabase) {
        console.log("Missing user ID or supabase client");
        return;
      }

      console.log("Fetching role for user ID:", user.id);

      // Try a simpler query approach (without .single())
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id);

      if (error) {
        console.error("Error fetching user role:", error);
        return;
      }

      // Check if we got any data back
      if (Array.isArray(data) && data.length > 0) {
        console.log("User role found:", data[0].role);
        setUserRole(data[0].role || "USER");
      } else {
        console.log("No user record found for ID:", user.id);
      }
    } catch (error) {
      console.error("Exception in fetchUserRole:", error);
    }
  };

  const fetchSubscription = async () => {
    try {
      // Validate prerequisites
      if (!user?.id || !supabase) {
        console.log(
          "Missing user ID or supabase client for subscription fetch"
        );
        return;
      }

      // Try a simpler query approach (without .single())
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching subscription:", error);
        return;
      }

      // Check if we got any active subscriptions
      if (Array.isArray(data) && data.length > 0) {
        // Use the most recent subscription if multiple found
        const latestSubscription = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )[0];

        console.log("Active subscription found:", latestSubscription.plan);
        setSubscription(latestSubscription);
      } else {
        console.log("No active subscription found");
        setSubscription(null);
      }
    } catch (error) {
      console.error("Exception in fetchSubscription:", error);
    }
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    // Show payment dialog for both plan types
    setIsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleExpiryInput = (e) => {
    let { value } = e.target;
    value = value.replace(/\D/g, "");

    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }

    setCardInfo((prev) => ({ ...prev, expiry: value }));
  };

  const handleCardNumberInput = (e) => {
    let { value } = e.target;
    value = value.replace(/\D/g, "").slice(0, 16);

    // Add spaces after every 4 digits
    if (value.length > 4) {
      value = value.match(/.{1,4}/g).join(" ");
    }

    setCardInfo((prev) => ({ ...prev, number: value }));
  };

  const handleSubscriptionUpdate = async (plan) => {
    // Basic validation
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Please sign in to subscribe",
        variant: "destructive",
      });
      return;
    }

    // Check if user is admin
    if (userRole === "ADMIN" && plan === "pro") {
      toast({
        title: "Not Allowed",
        description: "Admins cannot subscribe to agent plans.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setIsSubmitting(true);

    try {
      console.log("Attempting subscription update to plan:", plan);

      // Update user role in Supabase if upgrading to pro plan
      if (plan === "pro") {
        console.log("Updating user role to AGENT in database");
        const { data: userData, error: userUpdateError } =
          await supabase.auth.updateUser({
            data: { role: "agent" },
          });

        if (userUpdateError) {
          console.error("Error updating user role:", userUpdateError);
          throw new Error(
            `Failed to update user role: ${
              userUpdateError.message || "Unknown error"
            }`
          );
        }

        // Update local state
        setUserRole("AGENT");
        console.log("Updated role to AGENT in database and local state");
      }

      // Simple subscription data that matches our schema
      // Focus solely on the subscription - this is what we need to track payment
      const newSubscription = {
        user_id: user.id,
        plan: plan,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      // Simple operation - DELETE first if exists (avoids update issues)
      if (subscription?.id) {
        console.log("Removing existing subscription");
        await supabase.from("subscriptions").delete().eq("user_id", user.id);
      }

      // Insert new subscription with minimal fields to avoid schema issues
      console.log("Creating fresh subscription record");
      const { error: insertError } = await supabase
        .from("subscriptions")
        .insert(newSubscription);

      if (insertError) {
        console.log("Insert error details:", JSON.stringify(insertError));
        throw new Error(
          `Failed to create subscription: ${
            insertError.message || "Unknown error"
          }`
        );
      }

      // Refresh subscription data
      await fetchSubscription();

      // Success message
      toast({
        title: "Success!",
        description:
          plan === "pro"
            ? "You're now an Agent! Access to agent dashboard unlocked."
            : `Successfully subscribed to ${plan.toUpperCase()} plan!`,
        variant: "default",
      });

      // Close UI components
      setIsDialogOpen(false);
      setIsDrawerOpen(false);
      setCardInfo({ number: "", name: "", expiry: "", cvc: "" });

      // Store a user preference in localStorage to remember role upgrade
      if (plan === "pro") {
        localStorage.setItem("userRole", "AGENT");
        // Redirect to agent dashboard
        setTimeout(() => {
          window.location.href = "/agent";
        }, 1500);
      }
    } catch (error) {
      console.error("Subscription error:", error);

      // Show detailed error to user
      toast({
        title: "Subscription Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Add this to your useEffect to load role from localStorage
  useEffect(() => {
    // This will ensure the role persists across page refreshes
    const savedRole = localStorage.getItem("userRole");
    if (savedRole === "AGENT") {
      setUserRole("AGENT");
    }
  }, []);

  const isPlanActive = (planName) => {
    return subscription?.plan === planName && subscription?.is_active;
  };

  const renderSubscriptionButton = () => {
    if (!subscription) {
      return (
        <motion.button
          onClick={handleDrawerOpen}
          className="flex items-center gap-2 bg-white dark:bg-zinc-800 text-black dark:text-white px-6 py-3 rounded-2xl font-medium shadow-md hover:shadow-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Plus size={18} />
          <span>Subscribe</span>
        </motion.button>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="bg-white dark:bg-zinc-800/80 text-black dark:text-white backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span>
            Active:{" "}
            <span className="font-bold">
              {subscription.plan.toUpperCase()} Plan
            </span>
          </span>
        </div>
        <motion.button
          onClick={handleDrawerOpen}
          className="flex items-center justify-center gap-2 text-sm underline text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Manage Subscription
        </motion.button>
      </div>
    );
  };

  const renderPlanCard = (
    plan,
    title,
    price,
    period,
    description,
    features,
    isRecommended = false
  ) => {
    const isActive = isPlanActive(plan);
    const isDisabled = (userRole === "ADMIN" && plan === "pro") || isActive;

    return (
      <motion.div
        className={`border rounded-xl p-6 relative cursor-pointer ${
          selectedPlan === plan
            ? "border-blue-500"
            : isDisabled
            ? "border-zinc-300 dark:border-zinc-700 opacity-70"
            : "border-zinc-300 dark:border-zinc-800"
        } bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow`}
        whileHover={isDisabled ? {} : { y: -5 }}
        onClick={() => !isDisabled && setSelectedPlan(plan)}
      >
        {isRecommended && (
          <div className="absolute -top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Recommended
          </div>
        )}

        {isActive && (
          <div className="absolute -top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <BadgeCheck size={14} />
            <span>Active</span>
          </div>
        )}

        {userRole === "ADMIN" && plan === "pro" && (
          <div className="absolute -top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Shield size={14} />
            <span>Admin Only</span>
          </div>
        )}

        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-black dark:text-white">
              {title}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-black dark:text-white">
              ${price}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">{period}</p>
          </div>
        </div>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              {feature.included ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <X size={16} className="text-zinc-400 dark:text-zinc-600" />
              )}
              <span
                className={
                  feature.included
                    ? "text-zinc-700 dark:text-zinc-300"
                    : "text-zinc-400 dark:text-zinc-600"
                }
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
        <Button
          variant={plan === "pro" ? "default" : "outline"}
          className={`w-full ${
            plan === "pro"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white"
              : "dark:text-white"
          } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !isDisabled && handlePlanSelect(plan)}
          disabled={isDisabled}
        >
          {isActive ? "Current Plan" : `Continue with ${title}`}
        </Button>
      </motion.div>
    );
  };

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-gray-50 dark:bg-zinc-900 text-black dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 text-black dark:text-white">
              Unlock Premium Features
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Get access to advanced tools and features with our Pro
              subscription. List more properties, gain insights with analytics,
              and use agent tools.
            </p>
            {renderSubscriptionButton()}
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -top-6 -right-6 bg-yellow-500 text-black px-4 py-1 rounded-full font-medium text-sm transform rotate-12 z-10">
                Pro Feature
              </div>
              <img
                src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1974&auto=format"
                alt="Premium Analytics Dashboard"
                className="rounded-2xl w-full object-cover max-h-80 shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Plan Selection Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="bg-white dark:bg-zinc-900 w-full border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto w-full max-w-4xl">
            <DrawerHeader>
              <DrawerTitle className="text-2xl text-center text-black dark:text-white">
                Choose Your Plan
              </DrawerTitle>
              <DrawerDescription className="text-center text-zinc-600 dark:text-zinc-400">
                Select the plan that works best for you
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-center gap-4 w-full">
              {/* Free Plan */}
              {renderPlanCard(
                "free",
                "Free Plan",
                "0",
                "Forever free",
                "Basic features for casual users",
                [
                  { text: "Up to 5 property listings", included: true },
                  { text: "Basic property analytics", included: true },
                  { text: "Email support", included: true },
                  { text: "Advanced search filters", included: false },
                  { text: "Agent tools", included: false },
                ]
              )}

              {/* Pro Plan */}
              {renderPlanCard(
                "pro",
                "Pro Plan",
                "29",
                "per month",
                "For serious real estate professionals",
                [
                  { text: "Unlimited property listings", included: true },
                  { text: "Advanced property analytics", included: true },
                  { text: "Priority support", included: true },
                  { text: "Advanced search filters", included: true },
                  { text: "Complete agent toolkit", included: true },
                ],
                true
              )}
            </div>
            <DrawerFooter>
              <Button
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Cancel
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Payment Dialog */}
      <AnimatePresence>
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white max-w-md sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl text-black dark:text-white">
                  {selectedPlan === "free"
                    ? "Confirm Free Plan"
                    : "Unlock Agent Tools & Add Properties"}
                </DialogTitle>
                <DialogDescription className="text-zinc-600 dark:text-zinc-400">
                  {selectedPlan === "free" ? (
                    "Confirm your subscription to the Free plan"
                  ) : (
                    <>
                      Enter your payment information below to upgrade to Agent
                      status.
                      <span className="block text-xs mt-1 text-yellow-600 dark:text-yellow-500">
                        This is a demo - no real payment will be processed
                      </span>
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>

              {selectedPlan === "free" ? (
                <div className="py-6">
                  <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-lg mb-2 text-black dark:text-white">
                      Free Plan Summary
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        <span className="text-zinc-700 dark:text-zinc-300">
                          Up to 5 property listings
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        <span className="text-zinc-700 dark:text-zinc-300">
                          Basic property analytics
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        <span className="text-zinc-700 dark:text-zinc-300">
                          Email support
                        </span>
                      </li>
                    </ul>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-4">
                      Price: $0 - Forever free
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-lg mb-2 text-black dark:text-white">
                      Pro Plan Benefits
                    </h3>
                    <Badge className="bg-blue-600 text-white mb-2">
                      Role Upgrade: User → Agent
                    </Badge>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-2">
                      Price: $29/month
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Includes agent dashboard, unlimited listings, advanced
                      analytics, and all premium features
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="cardName"
                      className="text-sm text-zinc-600 dark:text-zinc-400"
                    >
                      Card Holder Name
                    </label>
                    <Input
                      id="cardName"
                      name="name"
                      placeholder="John Smith"
                      value={cardInfo.name}
                      onChange={handleInputChange}
                      className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-black dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="cardNumber"
                      className="text-sm text-zinc-600 dark:text-zinc-400"
                    >
                      Card Number
                    </label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        name="number"
                        placeholder="1234 5678 9101 1121"
                        value={cardInfo.number}
                        onChange={handleCardNumberInput}
                        maxLength={19}
                        className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-black dark:text-white pl-10"
                      />
                      <CreditCard
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="expiry"
                        className="text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        Expiration Date
                      </label>
                      <Input
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={cardInfo.expiry}
                        onChange={handleExpiryInput}
                        maxLength={5}
                        className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-black dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="cvc"
                        className="text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        CVC
                      </label>
                      <Input
                        id="cvc"
                        name="cvc"
                        placeholder="123"
                        value={cardInfo.cvc}
                        onChange={handleInputChange}
                        maxLength={3}
                        className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-black dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  disabled={
                    loading ||
                    isSubmitting ||
                    (userRole === "ADMIN" && selectedPlan === "pro")
                  }
                  onClick={() => handleSubscriptionUpdate(selectedPlan)}
                  className={`w-full ${
                    selectedPlan === "pro"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : selectedPlan === "free" ? (
                    "Confirm Free Plan"
                  ) : (
                    "Confirm Payment & Upgrade to Agent"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
}
