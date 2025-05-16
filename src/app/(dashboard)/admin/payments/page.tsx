"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Download,
  Filter,
  Search,
  ArrowUpDown,
  FileText,
  AlertCircle,
  RefreshCw,
  Loader2,
  CircleDollarSign,
  CreditCard,
  CheckCircle2,
  Calendar,
  Ban,
  ReceiptText,
  PlusCircle,
  Clock,
  XCircle,
  CalendarIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/shared/components/ui/calendar";
import { cn } from "@/shared/lib/utils";

// Define types for data from Supabase
interface User {
  id: string;
  email: string;
}

interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  is_active: boolean;
}

interface PaymentData {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "failed" | "refunded";
  type: "subscription" | "listing" | "commission";
  subscription_id?: string;
  created_at: string;
}

interface Payment {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "failed" | "refunded";
  type: "subscription" | "listing" | "commission";
  user_id: string;
  email: string;
  subscription_id?: string;
}

interface PaymentStats {
  totalPayments: number;
  pendingAmount: number;
  failedPayments: number;
  revenueThisMonth: number;
}

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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

// Payment status colors
const statusColors = {
  paid: {
    color: "bg-green-500",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-500",
    text: "text-green-700 dark:text-green-400",
    icon: <CheckCircle2 className="h-4 w-4 mr-1.5 text-green-500" />,
  },
  pending: {
    color: "bg-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-500",
    text: "text-yellow-700 dark:text-yellow-400",
    icon: <Clock className="h-4 w-4 mr-1.5 text-yellow-500" />,
  },
  failed: {
    color: "bg-red-500",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-500",
    text: "text-red-700 dark:text-red-400",
    icon: <XCircle className="h-4 w-4 mr-1.5 text-red-500" />,
  },
  refunded: {
    color: "bg-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-500",
    text: "text-blue-700 dark:text-blue-400",
    icon: <ReceiptText className="h-4 w-4 mr-1.5 text-blue-500" />,
  },
};

// Payment type icons
const typeIcons = {
  subscription: <CreditCard className="h-4 w-4 mr-1.5" />,
  listing: <FileText className="h-4 w-4 mr-1.5" />,
  commission: <CircleDollarSign className="h-4 w-4 mr-1.5" />,
};

export default function PaymentsPage() {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState<Date | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [sortColumn, setSortColumn] = React.useState("date");
  const [sortDirection, setSortDirection] = React.useState("desc");
  const [transactions, setTransactions] = React.useState<Payment[]>([]);
  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [paymentStats, setPaymentStats] = React.useState<PaymentStats>({
    totalPayments: 0,
    pendingAmount: 0,
    failedPayments: 0,
    revenueThisMonth: 0,
  });
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
  const [newPayment, setNewPayment] = React.useState({
    user_id: "",
    description: "",
    amount: "",
    status: "pending",
    type: "subscription",
    date: new Date().toISOString().split("T")[0],
  });

  // Fetch data from Supabase
  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch payments from payments table
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("*");

      if (paymentsError) throw paymentsError;

      // Fetch subscriptions to correlate with payments
      const { data: subsData, error: subsError } = await supabase
        .from("subscriptions")
        .select("*");

      if (subsError) throw subsError;

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, email");

      if (usersError) throw usersError;

      // Transform data for the UI
      const transformedPayments = paymentsData
        ? paymentsData.map((payment) => ({
            id: payment.id,
            date: payment.created_at
              ? payment.created_at.split("T")[0]
              : new Date().toISOString().split("T")[0],
            description: payment.description || "Payment",
            amount: payment.amount || 0,
            status: payment.status || "pending",
            type: payment.type || "subscription",
            user_id: payment.user_id,
            email:
              usersData?.find((user) => user.id === payment.user_id)?.email ||
              "Unknown",
            subscription_id: payment.subscription_id,
          }))
        : [];

      setTransactions(transformedPayments);
      setSubscriptions(subsData || []);
      setUsers(usersData || []);

      // Calculate payment stats
      calculatePaymentStats(transformedPayments);
    } catch (error) {
      console.error("Error fetching payment data:", error);
      toast({
        title: "Error",
        description: "Failed to load payment data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, toast]);

  React.useEffect(() => {
    fetchData();

    // Set up real-time subscription for payment changes
    const channel = supabase
      .channel("payments-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "payments",
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

  const calculatePaymentStats = (payments: Payment[]) => {
    // Total payments successfully processed
    const totalPaid = payments
      .filter((payment) => payment.status === "paid")
      .reduce(
        (sum, payment) =>
          sum +
          (typeof payment.amount === "number"
            ? payment.amount
            : parseFloat(String(payment.amount))),
        0
      );

    // Pending amount
    const pendingAmount = payments
      .filter((payment) => payment.status === "pending")
      .reduce(
        (sum, payment) =>
          sum +
          (typeof payment.amount === "number"
            ? payment.amount
            : parseFloat(String(payment.amount))),
        0
      );

    // Failed payments
    const failedAmount = payments
      .filter((payment) => payment.status === "failed")
      .reduce(
        (sum, payment) =>
          sum +
          (typeof payment.amount === "number"
            ? payment.amount
            : parseFloat(String(payment.amount))),
        0
      );

    // Revenue this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthRevenue = payments
      .filter((payment) => {
        const paymentDate = new Date(payment.date);
        return (
          payment.status === "paid" &&
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      })
      .reduce(
        (sum, payment) =>
          sum +
          (typeof payment.amount === "number"
            ? payment.amount
            : parseFloat(String(payment.amount))),
        0
      );

    setPaymentStats({
      totalPayments: Number(totalPaid.toFixed(2)),
      pendingAmount: Number(pendingAmount.toFixed(2)),
      failedPayments: Number(failedAmount.toFixed(2)),
      revenueThisMonth: Number(thisMonthRevenue.toFixed(2)),
    });
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Payment data has been updated",
    });
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle sort direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleUpdatePaymentStatus = async (
    id: string,
    newStatus: "paid" | "pending" | "failed" | "refunded"
  ) => {
    try {
      const { error } = await supabase
        .from("payments")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      // If status changed to paid, update related subscription
      if (newStatus === "paid") {
        const payment = transactions.find((t) => t.id === id);
        if (payment && payment.subscription_id) {
          // Update subscription to active
          await supabase
            .from("subscriptions")
            .update({ is_active: true })
            .eq("id", payment.subscription_id);
        }
      }

      toast({
        title: "Payment Updated",
        description: `Payment status changed to ${newStatus}`,
      });

      await fetchData();
    } catch (error) {
      console.error("Error updating payment:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Could not update payment status",
        variant: "destructive",
      });
    }
  };

  const handleCreatePayment = async () => {
    try {
      if (!newPayment.user_id || !newPayment.amount) {
        toast({
          title: "Missing Information",
          description: "Please fill all required fields",
          variant: "destructive",
        });
        return;
      }

      const paymentAmount = parseFloat(newPayment.amount);
      if (isNaN(paymentAmount) || paymentAmount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid payment amount",
          variant: "destructive",
        });
        return;
      }

      // Check if this is related to a subscription
      let subscriptionId: string | undefined = undefined;
      if (newPayment.type === "subscription") {
        // Find active subscription for user
        const userSubscription = subscriptions.find(
          (sub) => sub.user_id === newPayment.user_id && sub.is_active
        );
        subscriptionId = userSubscription?.id;
      }

      // Insert payment record
      const { data, error } = await supabase
        .from("payments")
        .insert({
          user_id: newPayment.user_id,
          description: newPayment.description,
          amount: paymentAmount,
          status: newPayment.status,
          type: newPayment.type,
          subscription_id: subscriptionId,
          created_at: new Date(newPayment.date).toISOString(),
        })
        .select();

      if (error) throw error;

      toast({
        title: "Payment Created",
        description: "New payment record has been added",
      });

      setIsPaymentDialogOpen(false);
      setNewPayment({
        user_id: "",
        description: "",
        amount: "",
        status: "pending",
        type: "subscription",
        date: new Date().toISOString().split("T")[0],
      });

      await fetchData();
    } catch (error) {
      console.error("Error creating payment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create payment",
        variant: "destructive",
      });
    }
  };

  const filteredTransactions = React.useMemo(() => {
    return transactions
      .filter((transaction) => {
        const matchesSearch =
          transaction.id
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          transaction.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          transaction.email?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || transaction.status === statusFilter;
        const matchesType =
          typeFilter === "all" || transaction.type === typeFilter;

        // Filter by date if dateFilter is set
        const matchesDate =
          !dateFilter || transaction.date === format(dateFilter, "yyyy-MM-dd");

        return matchesSearch && matchesStatus && matchesType && matchesDate;
      })
      .sort((a, b) => {
        // Handle sorting
        if (sortColumn === "date") {
          return sortDirection === "asc"
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortColumn === "amount") {
          return sortDirection === "asc"
            ? parseFloat(a.amount.toString()) - parseFloat(b.amount.toString())
            : parseFloat(b.amount.toString()) - parseFloat(a.amount.toString());
        }
        if (
          sortColumn === "id" ||
          sortColumn === "description" ||
          sortColumn === "status" ||
          sortColumn === "type" ||
          sortColumn === "email"
        ) {
          const aValue = a[sortColumn]?.toString().toLowerCase() || "";
          const bValue = b[sortColumn]?.toString().toLowerCase() || "";
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
  }, [
    transactions,
    searchQuery,
    statusFilter,
    typeFilter,
    dateFilter,
    sortColumn,
    sortDirection,
  ]);

  const getSortIcon = (column) => {
    if (sortColumn !== column)
      return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUpDown className="ml-1 h-4 w-4 text-primary" />
    ) : (
      <ArrowUpDown className="ml-1 h-4 w-4 text-primary rotate-180" />
    );
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
            Payment Management
          </h1>
          <p className="text-muted-foreground">
            Track and manage payment transactions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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
          <Button
            onClick={() => setIsPaymentDialogOpen(true)}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New Payment
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Payments
              </CardTitle>
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">
                  ${paymentStats.totalPayments}
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
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">
                  ${paymentStats.revenueThisMonth}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Amount
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">
                  ${paymentStats.pendingAmount}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Failed Payments
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">
                  ${paymentStats.failedPayments}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filter Controls */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Type</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="listing">Listing</SelectItem>
                <SelectItem value="commission">Commission</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[140px] justify-start text-left font-normal",
                    !dateFilter && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? (
                    format(dateFilter, "PPP")
                  ) : (
                    <span>Pick date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={dateFilter}
                  onSelect={(date: Date | undefined) => setDateFilter(date)}
                  initialFocus
                />
                {dateFilter && (
                  <div className="p-3 border-t border-border">
                    <Button
                      variant="ghost"
                      className="w-full justify-center"
                      onClick={() => setDateFilter(undefined)}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div variants={item} className="rounded-md border">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    ID {getSortIcon("id")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date {getSortIcon("date")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    Customer {getSortIcon("email")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("description")}
                >
                  <div className="flex items-center">
                    Description {getSortIcon("description")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center">
                    Amount {getSortIcon("amount")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status {getSortIcon("status")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center">
                    Type {getSortIcon("type")}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.id?.toString().substring(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {transaction.date}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.email}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      $
                      {typeof transaction.amount === "number"
                        ? transaction.amount.toFixed(2)
                        : parseFloat(String(transaction.amount)).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Badge
                          variant="outline"
                          className={`${statusColors[transaction.status]?.bg} ${
                            statusColors[transaction.status]?.text
                          } flex items-center`}
                        >
                          {statusColors[transaction.status]?.icon}
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {typeIcons[transaction.type]}
                        {transaction.type.charAt(0).toUpperCase() +
                          transaction.type.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        {transaction.status === "pending" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleUpdatePaymentStatus(
                                      transaction.id,
                                      "paid"
                                    )
                                  }
                                >
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Mark as paid</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {transaction.status === "pending" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleUpdatePaymentStatus(
                                      transaction.id,
                                      "failed"
                                    )
                                  }
                                >
                                  <Ban className="h-4 w-4 text-red-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Mark as failed</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {transaction.status === "paid" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleUpdatePaymentStatus(
                                      transaction.id,
                                      "refunded"
                                    )
                                  }
                                >
                                  <ReceiptText className="h-4 w-4 text-blue-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Mark as refunded</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </motion.div>

      {/* New Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Payment</DialogTitle>
            <DialogDescription>
              Create a new payment transaction
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="user" className="text-right text-sm font-medium">
                User
              </label>
              <div className="col-span-3">
                <Select
                  value={newPayment.user_id}
                  onValueChange={(value) =>
                    setNewPayment({ ...newPayment, user_id: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="amount"
                className="text-right text-sm font-medium"
              >
                Amount
              </label>
              <div className="col-span-3">
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    value={newPayment.amount}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, amount: e.target.value })
                    }
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="description"
                className="text-right text-sm font-medium"
              >
                Description
              </label>
              <Input
                id="description"
                placeholder="Payment description"
                className="col-span-3"
                value={newPayment.description}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right text-sm font-medium">
                Type
              </label>
              <div className="col-span-3">
                <Select
                  value={newPayment.type}
                  onValueChange={(value) =>
                    setNewPayment({ ...newPayment, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="listing">Listing</SelectItem>
                    <SelectItem value="commission">Commission</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="status"
                className="text-right text-sm font-medium"
              >
                Status
              </label>
              <div className="col-span-3">
                <Select
                  value={newPayment.status}
                  onValueChange={(value) =>
                    setNewPayment({ ...newPayment, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right text-sm font-medium">
                Date
              </label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newPayment.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newPayment.date ? (
                        newPayment.date
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={
                        newPayment.date ? new Date(newPayment.date) : undefined
                      }
                      onSelect={(date) =>
                        setNewPayment({
                          ...newPayment,
                          date: date ? format(date, "yyyy-MM-dd") : "",
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreatePayment}>Create Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
