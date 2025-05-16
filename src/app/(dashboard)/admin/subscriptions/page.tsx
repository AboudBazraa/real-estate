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
  MoreHorizontal,
  BarChart3,
  Users,
  ListFilter,
  UserCog,
  Search,
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
import { useSupabase } from "@/shared/providers/SupabaseProvider";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

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

// Define types for Supabase data
interface User {
  id: string;
  email: string;
  role?: string;
  user_metadata?: {
    role?: string;
  };
}

interface Subscription {
  id: string;
  user_id: string;
  plan: "free" | "pro" | "enterprise";
  is_active: boolean;
  created_at: string;
}

interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  revenue: number;
  proUsers: number;
  freeUsers: number;
  enterpriseUsers: number;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  current: boolean;
  popular?: boolean;
}

// Plan definitions
const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    description: "Basic features for individual users",
    features: [
      "Up to 5 property listings",
      "Basic property analytics",
      "Email support",
    ],
    current: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    interval: "month",
    description: "For serious real estate professionals",
    features: [
      "Unlimited property listings",
      "Advanced property analytics",
      "Priority support",
      "Advanced search filters",
      "Complete agent toolkit",
    ],
    current: true,
    popular: true,
  },
  {
    id: "enterprise",
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
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("overview");
  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [planFilter, setPlanFilter] = React.useState("all");
  const [isUserDialogOpen, setIsUserDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [userPlan, setUserPlan] = React.useState("");
  const [isUpdatingSubscription, setIsUpdatingSubscription] =
    React.useState(false);
  const [stats, setStats] = React.useState<SubscriptionStats>({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    revenue: 0,
    proUsers: 0,
    freeUsers: 0,
    enterpriseUsers: 0,
  });

  // Fetch all subscriptions and users
  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // Get all subscriptions
      const { data: subscriptionsData, error: subscriptionsError } =
        await supabase.from("subscriptions").select("*");

      if (subscriptionsError) throw subscriptionsError;

      // Get all users with their metadata
      const { data: usersData, error: usersError } =
        await supabase.auth.admin.listUsers();

      // Fallback if admin API not accessible - use public profile data
      let userData = [];
      if (usersError || !usersData) {
        const { data, error } = await supabase
          .from("users")
          .select("id, email, role");

        if (!error) {
          userData = data || [];
        }
      } else {
        userData = usersData.users || [];
      }

      setSubscriptions(subscriptionsData || []);
      setUsers(userData);

      // Calculate stats
      calculateStats(subscriptionsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load subscription data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, toast]);

  React.useEffect(() => {
    fetchData();

    // Set up real-time subscription for subscription changes
    const channel = supabase
      .channel("subscriptions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, supabase]);

  const calculateStats = (subscriptionsData: Subscription[]) => {
    const active = subscriptionsData.filter((sub) => sub.is_active);
    const proSubs = active.filter((sub) => sub.plan === "pro");
    const freeSubs = active.filter((sub) => sub.plan === "free");
    const enterpriseSubs = active.filter((sub) => sub.plan === "enterprise");

    // Calculate total monthly revenue
    const revenue = proSubs.length * 29 + enterpriseSubs.length * 299;

    setStats({
      totalSubscriptions: subscriptionsData.length,
      activeSubscriptions: active.length,
      revenue: revenue,
      proUsers: proSubs.length,
      freeUsers: freeSubs.length,
      enterpriseUsers: enterpriseSubs.length,
    });
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Subscription data has been updated",
    });
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);

    // Find user's subscription
    const userSubscription = subscriptions.find(
      (sub) => sub.user_id === user.id && sub.is_active
    );

    setUserPlan(userSubscription?.plan || "free");
    setIsUserDialogOpen(true);
  };

  const handleUpdateUserSubscription = async () => {
    if (!selectedUser || isUpdatingSubscription) return;

    setIsUpdatingSubscription(true);
    try {
      // Find existing subscription
      const existingSubscription = subscriptions.find(
        (sub) => sub.user_id === selectedUser.id && sub.is_active
      );

      // If exists, update plan
      if (existingSubscription) {
        await supabase
          .from("subscriptions")
          .update({ plan: userPlan })
          .eq("id", existingSubscription.id);
      } else {
        // Otherwise create new subscription
        await supabase.from("subscriptions").insert({
          user_id: selectedUser.id,
          plan: userPlan,
          is_active: true,
          created_at: new Date().toISOString(),
        });
      }

      // If upgrading to pro, update user role
      if (userPlan === "pro") {
        await supabase.auth.admin
          .updateUserById(selectedUser.id, {
            user_metadata: { role: "agent" },
          })
          .catch(async () => {
            // Fallback if admin API not available
            await supabase.auth.updateUser({
              data: { role: "agent" },
            });
          });
      }

      toast({
        title: "Subscription Updated",
        description: `${selectedUser.email}'s subscription changed to ${userPlan}`,
      });

      setIsUserDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update subscription",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingSubscription(false);
    }
  };

  const handleCancelSubscription = async (userId: string) => {
    try {
      // Find active subscription
      const subscription = subscriptions.find(
        (sub) => sub.user_id === userId && sub.is_active
      );

      if (!subscription) {
        toast({
          title: "No Active Subscription",
          description: "This user doesn't have an active subscription",
          variant: "destructive",
        });
        return;
      }

      // Update subscription to inactive
      await supabase
        .from("subscriptions")
        .update({ is_active: false })
        .eq("id", subscription.id);

      toast({
        title: "Subscription Cancelled",
        description: "The subscription has been cancelled",
      });

      fetchData();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  };

  // Filter users based on search and filter criteria
  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const email = user.email?.toLowerCase() || "";
      const matchesSearch = email.includes(searchQuery.toLowerCase());

      // Find user's active subscription
      const userSubscription = subscriptions.find(
        (sub) => sub.user_id === user.id && sub.is_active
      );

      const userPlan = userSubscription?.plan || "free";
      const isActive = !!userSubscription?.is_active;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "inactive" && !isActive);

      const matchesPlan = planFilter === "all" || userPlan === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [users, subscriptions, searchQuery, statusFilter, planFilter]);

  // Get user subscription status
  const getUserSubscription = (userId: string) => {
    return subscriptions.find((sub) => sub.user_id === userId && sub.is_active);
  };

  // Find what plan a user is on
  const getUserPlan = (userId: string) => {
    const subscription = getUserSubscription(userId);
    return subscription?.plan || "free";
  };

  // Get the plan details object by plan ID
  const getPlanDetails = (planId: string) => {
    return plans.find((plan) => plan.id === planId) || plans[0];
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
            Subscription Management
          </h1>
          <p className="text-muted-foreground">
            Manage and track user subscriptions
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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Plan
          </Button>
        </div>
      </motion.div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Subscriptions</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <motion.div variants={container} initial="hidden" animate="show">
            <div className="grid gap-4 md:grid-cols-4">
              <motion.div variants={item}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Active Subscriptions
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <div className="text-2xl font-bold">
                        {stats.activeSubscriptions}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Monthly Revenue
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <div className="text-2xl font-bold">${stats.revenue}</div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pro Users
                    </CardTitle>
                    <UserCog className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <div className="text-2xl font-bold">{stats.proUsers}</div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Free Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <div className="text-2xl font-bold">
                        {stats.freeUsers}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="users" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>User Subscriptions</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search users..."
                      className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[130px]">
                        <ListFilter className="mr-2 h-4 w-4" />
                        <span>Status</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={planFilter} onValueChange={setPlanFilter}>
                      <SelectTrigger className="w-[130px]">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Plan</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Plans</SelectItem>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No users found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => {
                          const subscription = getUserSubscription(user.id);
                          const planId = subscription?.plan || "free";
                          const planDetail = getPlanDetails(planId);

                          return (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">
                                {user.email}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    planId === "free" ? "outline" : "default"
                                  }
                                  className={
                                    planId === "pro"
                                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200"
                                      : planId === "enterprise"
                                      ? "bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-200"
                                      : ""
                                  }
                                >
                                  {planDetail.name}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {subscription?.is_active ? (
                                  <Badge
                                    variant="default"
                                    className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200"
                                  >
                                    Active
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Inactive</Badge>
                                )}
                              </TableCell>
                              <TableCell>${planDetail.price}/mo</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleSelectUser(user)}
                                    >
                                      Change Plan
                                    </DropdownMenuItem>
                                    {subscription?.is_active && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleCancelSubscription(user.id)
                                        }
                                      >
                                        Cancel Subscription
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="mt-0">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`h-full relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  plan.popular ? "border-primary/50" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -right-12 top-5 transform rotate-45 bg-primary text-primary-foreground px-10 py-1 text-xs font-medium">
                    Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">{plan.name}</span>
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
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Edit Plan",
                        description: `Editing ${plan.name} plan settings`,
                      });
                    }}
                  >
                    Edit Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Change Plan Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Subscription</DialogTitle>
            <DialogDescription>
              Change the subscription plan for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={userPlan} onValueChange={setUserPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="free">Free Plan</SelectItem>
                  <SelectItem value="pro">Pro Plan ($29/month)</SelectItem>
                  <SelectItem value="enterprise">
                    Enterprise Plan ($299/month)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {userPlan === "pro" && (
              <p className="mt-2 text-sm text-muted-foreground">
                <AlertCircle className="inline-block h-4 w-4 mr-1" />
                The user will be upgraded to AGENT role when subscribing to Pro
                plan.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsUserDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUserSubscription}
              disabled={isUpdatingSubscription}
            >
              {isUpdatingSubscription ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Subscription"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
