"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Download,
  Filter,
  Search,
  TrendingUp,
  Eye,
  Calendar,
  Loader2,
  RefreshCw,
  ArrowUpDown,
} from "lucide-react";
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

const commissions = [
  {
    id: "COM-001",
    agent: "Sarah Johnson",
    property: "123 Main St",
    salePrice: 450000,
    commission: 13500,
    rate: 3,
    status: "paid",
    date: "2024-02-25",
  },
  {
    id: "COM-002",
    agent: "Michael Chen",
    property: "456 Oak Ave",
    salePrice: 375000,
    commission: 11250,
    rate: 3,
    status: "pending",
    date: "2024-02-24",
  },
  {
    id: "COM-003",
    agent: "Emily Rodriguez",
    property: "789 Pine Rd",
    salePrice: 525000,
    commission: 15750,
    rate: 3,
    status: "paid",
    date: "2024-02-23",
  },
  {
    id: "COM-004",
    agent: "David Kim",
    property: "321 Elm St",
    salePrice: 299000,
    commission: 8970,
    rate: 3,
    status: "pending",
    date: "2024-02-22",
  },
];

const stats = [
  {
    title: "Total Commissions",
    value: "$49,470",
    change: "+12.5%",
    changeType: "positive",
  },
  {
    title: "Average Commission",
    value: "$12,367",
    change: "+5.2%",
    changeType: "positive",
  },
  {
    title: "Pending Commissions",
    value: "$20,220",
    change: "-2.3%",
    changeType: "negative",
  },
  {
    title: "Commission Rate",
    value: "3%",
    change: "0%",
    changeType: "neutral",
  },
];

export default function CommissionsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
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

  const filteredCommissions = React.useMemo(() => {
    return commissions
      .filter((commission) => {
        const matchesSearch =
          commission.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
          commission.property
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          commission.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || commission.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        // Handle sorting
        if (sortColumn === "date") {
          return sortDirection === "asc"
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortColumn === "salePrice" || sortColumn === "commission") {
          return sortDirection === "asc"
            ? a[sortColumn] - b[sortColumn]
            : b[sortColumn] - a[sortColumn];
        }
        if (sortColumn === "agent" || sortColumn === "property") {
          return sortDirection === "asc"
            ? a[sortColumn].localeCompare(b[sortColumn])
            : b[sortColumn].localeCompare(a[sortColumn]);
        }
        return 0;
      });
  }, [searchQuery, statusFilter, sortColumn, sortDirection]);

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
            Agent Commissions
          </h1>
          <p className="text-muted-foreground">
            Track and manage agent commission payments
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
            Export Report
          </Button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="stats-loading"
            className="grid gap-4 md:grid-cols-4"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
          >
            {[1, 2, 3, 4].map((i) => (
              <motion.div key={i} variants={item}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-24 mb-1" />
                    <Skeleton className="h-4 w-28" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="stats-loaded"
            className="grid gap-4 md:grid-cols-4"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
          >
            {stats.map((stat) => (
              <motion.div key={stat.title} variants={item}>
                <Card
                  className="overflow-hidden border-l-4 transition-all hover:shadow-md"
                  style={{
                    borderLeftColor:
                      stat.changeType === "positive"
                        ? "var(--green-500)"
                        : stat.changeType === "negative"
                        ? "var(--red-500)"
                        : "var(--border)",
                  }}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <TrendingUp
                      className={`h-4 w-4 ${
                        stat.changeType === "positive"
                          ? "text-green-500"
                          : stat.changeType === "negative"
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p
                      className={`text-xs flex items-center ${
                        stat.changeType === "positive"
                          ? "text-green-500"
                          : stat.changeType === "negative"
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
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
            placeholder="Search commissions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
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
                  <TableHead>Commission ID</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Sale Price</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
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
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
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
                  <TableHead>Commission ID</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("agent")}
                  >
                    <div className="flex items-center">
                      Agent
                      {getSortIcon("agent")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("property")}
                  >
                    <div className="flex items-center">
                      Property
                      {getSortIcon("property")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("salePrice")}
                  >
                    <div className="flex items-center">
                      Sale Price
                      {getSortIcon("salePrice")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("commission")}
                  >
                    <div className="flex items-center">
                      Commission
                      {getSortIcon("commission")}
                    </div>
                  </TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center">
                      Date
                      {getSortIcon("date")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredCommissions.map((commission, index) => (
                    <motion.tr
                      key={commission.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group"
                    >
                      <TableCell className="font-medium">
                        {commission.id}
                      </TableCell>
                      <TableCell>{commission.agent}</TableCell>
                      <TableCell>{commission.property}</TableCell>
                      <TableCell>
                        ${commission.salePrice.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ${commission.commission.toLocaleString()}
                      </TableCell>
                      <TableCell>{commission.rate}%</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`capitalize transition-colors duration-300 ${
                            commission.status === "paid"
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-yellow-500 bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {commission.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {new Date(commission.date).toLocaleDateString()}
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
                                <Eye className="h-3.5 w-3.5" />
                                View Details
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View commission details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredCommissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="mb-2 h-8 w-8" />
                        <p className="mb-2 text-lg font-medium">
                          No results found
                        </p>
                        <p className="text-sm">
                          Try adjusting your search or filter to find what
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
