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
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

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

const transactions = [
  {
    id: "INV-001",
    date: "2024-02-25",
    description: "Professional Plan - Monthly",
    amount: 99.0,
    status: "paid",
    type: "subscription",
  },
  {
    id: "INV-002",
    date: "2024-02-24",
    description: "Property Listing Fee - 123 Main St",
    amount: 49.99,
    status: "pending",
    type: "listing",
  },
  {
    id: "INV-003",
    date: "2024-02-23",
    description: "Agent Commission - Sarah Johnson",
    amount: 1250.0,
    status: "paid",
    type: "commission",
  },
  {
    id: "INV-004",
    date: "2024-02-22",
    description: "Featured Listing - 456 Oak Ave",
    amount: 29.99,
    status: "failed",
    type: "listing",
  },
  {
    id: "INV-005",
    date: "2024-02-21",
    description: "Professional Plan - Monthly",
    amount: 99.0,
    status: "paid",
    type: "subscription",
  },
];

const statusColors = {
  paid: {
    color: "bg-green-500",
    bg: "bg-green-50",
    border: "border-green-500",
    text: "text-green-700",
  },
  pending: {
    color: "bg-yellow-500",
    bg: "bg-yellow-50",
    border: "border-yellow-500",
    text: "text-yellow-700",
  },
  failed: {
    color: "bg-red-500",
    bg: "bg-red-50",
    border: "border-red-500",
    text: "text-red-700",
  },
};

const typeIcons = {
  subscription: <CreditCard className="h-4 w-4 mr-1.5" />,
  listing: <FileText className="h-4 w-4 mr-1.5" />,
  commission: <CircleDollarSign className="h-4 w-4 mr-1.5" />,
};

// Summary stats
const paymentStats = [
  {
    title: "Total Payments",
    value: "$1,528.98",
    icon: <CircleDollarSign className="h-5 w-5" />,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Pending Amount",
    value: "$49.99",
    icon: <AlertCircle className="h-5 w-5" />,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "Failed Payments",
    value: "$29.99",
    icon: <AlertCircle className="h-5 w-5" />,
    color: "bg-red-100 text-red-700",
  },
];

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [sortColumn, setSortColumn] = React.useState("date");
  const [sortDirection, setSortDirection] = React.useState("desc");

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

  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle sort direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredTransactions = React.useMemo(() => {
    return transactions
      .filter((transaction) => {
        const matchesSearch =
          transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || transaction.status === statusFilter;
        const matchesType =
          typeFilter === "all" || transaction.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
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
            ? a.amount - b.amount
            : b.amount - a.amount;
        }
        if (
          sortColumn === "id" ||
          sortColumn === "description" ||
          sortColumn === "status" ||
          sortColumn === "type"
        ) {
          return sortDirection === "asc"
            ? a[sortColumn].localeCompare(b[sortColumn])
            : b[sortColumn].localeCompare(a[sortColumn]);
        }
        return 0;
      });
  }, [searchQuery, statusFilter, typeFilter, sortColumn, sortDirection]);

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
            Payments & Invoices
          </h1>
          <p className="text-muted-foreground">
            Manage your payments and view invoices
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
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="stats-loading"
            className="grid gap-4 md:grid-cols-3"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div key={i} variants={item}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-24 mb-1" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="stats-loaded"
            className="grid gap-4 md:grid-cols-3"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
          >
            {paymentStats.map((stat, index) => (
              <motion.div key={index} variants={item}>
                <Card className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-full ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={item}
        className="flex flex-col gap-4 md:flex-row md:items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="listing">Listing</SelectItem>
              <SelectItem value="commission">Commission</SelectItem>
            </SelectContent>
          </Select>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More filters</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="table-loading"
            variants={fadeIn}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="rounded-md border"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-9 w-24 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        ) : (
          <motion.div
            key="table-loaded"
            variants={fadeIn}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="rounded-md border"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center">
                      Invoice ID
                      {getSortIcon("id")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center">
                      Date
                      {getSortIcon("date")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("description")}
                  >
                    <div className="flex items-center">
                      Description
                      {getSortIcon("description")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center">
                      Amount
                      {getSortIcon("amount")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center">
                      Type
                      {getSortIcon("type")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group"
                    >
                      <TableCell className="font-medium">
                        {transaction.id}
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        className="max-w-[300px] truncate"
                        title={transaction.description}
                      >
                        {transaction.description}
                      </TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`capitalize transition-colors duration-300 ${
                            statusColors[transaction.status].border
                          } ${statusColors[transaction.status].bg} ${
                            statusColors[transaction.status].text
                          }`}
                        >
                          <div
                            className={`mr-1.5 h-2 w-2 rounded-full inline-block ${
                              statusColors[transaction.status].color
                            }`}
                          />
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize flex items-center">
                        {typeIcons[transaction.type]}
                        {transaction.type}
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                View Invoice
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View invoice details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="mb-2 h-8 w-8" />
                        <p className="mb-2 text-lg font-medium">
                          No results found
                        </p>
                        <p className="text-sm">
                          Try adjusting your search or filters to find what
                          you&apos;re looking for.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>

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
