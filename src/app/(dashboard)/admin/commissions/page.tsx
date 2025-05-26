"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
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
  BarChart3,
  User,
  Home,
  DollarSign,
  MoreHorizontal,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarIcon,
} from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { motion } from "framer-motion";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Calendar as CalendarComponent } from "@/shared/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/shared/lib/utils";
import { useTranslation } from "@/shared/hooks/useTranslation";
import commissionsTranslations from "./translations";
import LanguageSwitcher from "./components/LanguageSwitcher";

// Define types for data from Supabase
interface Agent {
  id: string;
  email: string;
  role: string;
}

interface Property {
  id: string;
  address: string;
}

interface CommissionData {
  id: string;
  agent_id: string;
  property_id: string | null;
  property_address: string | null;
  sale_price: number;
  commission: number;
  rate: number;
  status: "paid" | "pending" | "cancelled";
  created_at: string;
}

interface Commission {
  id: string;
  agent: string;
  agent_id: string;
  property: string;
  property_id: string | null;
  salePrice: number;
  commission: number;
  rate: number;
  status: "paid" | "pending" | "cancelled";
  date: string;
}

interface CommissionStats {
  totalCommissions: number;
  averageCommission: number;
  pendingCommissions: number;
  averageRate: number;
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

// Status indicator colors
const statusColors = {
  paid: {
    bg: "bg-green-100 dark:bg-green-900/20",
    text: "text-green-800 dark:text-green-300",
    icon: <CheckCircle2 className="h-4 w-4 mr-1.5 text-green-500" />,
  },
  pending: {
    bg: "bg-yellow-100 dark:bg-yellow-900/20",
    text: "text-yellow-800 dark:text-yellow-300",
    icon: <Clock className="h-4 w-4 mr-1.5 text-yellow-500" />,
  },
  cancelled: {
    bg: "bg-red-100 dark:bg-red-900/20",
    text: "text-red-800 dark:text-red-300",
    icon: <XCircle className="h-4 w-4 mr-1.5 text-red-500" />,
  },
};

export default function CommissionsPage() {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const { currentLanguage, isRTL } = useTranslation();
  const t =
    commissionsTranslations[currentLanguage] || commissionsTranslations.en;
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState<Date | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [sortColumn, setSortColumn] = React.useState("date");
  const [sortDirection, setSortDirection] = React.useState("desc");
  const [commissions, setCommissions] = React.useState<Commission[]>([]);
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [stats, setStats] = React.useState<CommissionStats>({
    totalCommissions: 0,
    averageCommission: 0,
    pendingCommissions: 0,
    averageRate: 0,
  });
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] =
    React.useState(false);
  const [newCommission, setNewCommission] = React.useState({
    agent_id: "",
    property_id: "",
    property_address: "",
    sale_price: "",
    commission: "",
    rate: "3",
    status: "pending",
    date: new Date().toISOString().split("T")[0],
  });

  // Fetch data from Supabase
  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch commissions
      const { data: commissionsData, error: commissionsError } = await supabase
        .from("commissions")
        .select("*");

      if (commissionsError) throw commissionsError;

      // Fetch agents (users with agent role)
      const { data: agentsData, error: agentsError } = await supabase
        .from("users")
        .select("id, email, role")
        .eq("role", "agent");

      if (agentsError) throw agentsError;

      // Fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from("properties")
        .select("id, address");

      if (propertiesError) throw propertiesError;

      // Transform commissions data for the UI
      const transformedCommissions = commissionsData
        ? commissionsData.map((commission) => {
            const agent = agentsData?.find((a) => a.id === commission.agent_id);
            const property = propertiesData?.find(
              (p) => p.id === commission.property_id
            );

            return {
              id: commission.id,
              agent: agent?.email || "Unknown Agent",
              agent_id: commission.agent_id,
              property:
                property?.address ||
                commission.property_address ||
                "Unknown Property",
              property_id: commission.property_id,
              salePrice: commission.sale_price || 0,
              commission: commission.commission || 0,
              rate: commission.rate || 3,
              status: commission.status || "pending",
              date: commission.created_at
                ? commission.created_at.split("T")[0]
                : new Date().toISOString().split("T")[0],
            };
          })
        : [];

      setCommissions(transformedCommissions);
      setAgents(agentsData || []);
      setProperties(propertiesData || []);

      // Calculate statistics
      calculateStats(transformedCommissions);
    } catch (error) {
      console.error("Error fetching commission data:", error);
      toast({
        title: "Error",
        description: "Failed to load commission data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, toast]);

  React.useEffect(() => {
    fetchData();

    // Set up real-time subscription for commission changes
    const channel = supabase
      .channel("commissions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "commissions",
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

  const calculateStats = (commissions: Commission[]) => {
    if (!commissions || commissions.length === 0) {
      setStats({
        totalCommissions: 0,
        averageCommission: 0,
        pendingCommissions: 0,
        averageRate: 0,
      });
      return;
    }

    // Total commissions (paid)
    const paidCommissions = commissions.filter((c) => c.status === "paid");
    const totalCommissions = paidCommissions.reduce(
      (sum, c) => sum + parseFloat(c.commission.toString()),
      0
    );

    // Average commission
    const averageCommission =
      paidCommissions.length > 0
        ? totalCommissions / paidCommissions.length
        : 0;

    // Pending commissions
    const pendingCommissions = commissions
      .filter((c) => c.status === "pending")
      .reduce((sum, c) => sum + parseFloat(c.commission.toString()), 0);

    // Average rate
    const totalRate = commissions.reduce(
      (sum, c) => sum + parseFloat(c.rate.toString()),
      0
    );
    const averageRate =
      commissions.length > 0 ? totalRate / commissions.length : 0;

    setStats({
      totalCommissions: Number(totalCommissions.toFixed(2)),
      averageCommission: Number(averageCommission.toFixed(2)),
      pendingCommissions: Number(pendingCommissions.toFixed(2)),
      averageRate: Number(averageRate.toFixed(2)),
    });
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Commission data has been updated",
    });
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleUpdateCommissionStatus = async (
    id: string,
    newStatus: "paid" | "pending" | "cancelled"
  ) => {
    try {
      const { error } = await supabase
        .from("commissions")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      // If this commission is approved (paid), create a payment record
      if (newStatus === "paid") {
        const commission = commissions.find((c) => c.id === id);
        if (commission) {
          // Create a payment record
          await supabase.from("payments").insert({
            user_id: commission.agent_id,
            description: `Commission for ${commission.property}`,
            amount: commission.commission,
            status: "paid",
            type: "commission",
            created_at: new Date().toISOString(),
          });
        }
      }

      toast({
        title: "Commission Updated",
        description: `Commission status changed to ${newStatus}`,
      });

      await fetchData();
    } catch (error) {
      console.error("Error updating commission:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Could not update commission status",
        variant: "destructive",
      });
    }
  };

  const handleCreateCommission = async () => {
    try {
      if (!newCommission.agent_id || !newCommission.sale_price) {
        toast({
          title: "Missing Information",
          description: "Please fill all required fields",
          variant: "destructive",
        });
        return;
      }

      const salePrice = parseFloat(newCommission.sale_price);
      const rate = parseFloat(newCommission.rate);

      if (isNaN(salePrice) || salePrice <= 0) {
        toast({
          title: "Invalid Sale Price",
          description: "Please enter a valid sale price",
          variant: "destructive",
        });
        return;
      }

      // Calculate commission
      const commissionAmount = salePrice * (rate / 100);

      // Insert commission record
      const { data, error } = await supabase
        .from("commissions")
        .insert({
          agent_id: newCommission.agent_id,
          property_id: newCommission.property_id || null,
          property_address: newCommission.property_address || null,
          sale_price: salePrice,
          commission: commissionAmount,
          rate: rate,
          status: newCommission.status,
          created_at: new Date(newCommission.date).toISOString(),
        })
        .select();

      if (error) throw error;

      toast({
        title: "Commission Created",
        description: "New commission record has been added",
      });

      setIsCommissionDialogOpen(false);
      setNewCommission({
        agent_id: "",
        property_id: "",
        property_address: "",
        sale_price: "",
        commission: "",
        rate: "3",
        status: "pending",
        date: new Date().toISOString().split("T")[0],
      });

      await fetchData();
    } catch (error) {
      console.error("Error creating commission:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create commission",
        variant: "destructive",
      });
    }
  };

  const filteredCommissions = React.useMemo(() => {
    return commissions
      .filter((commission) => {
        const matchesSearch =
          commission.agent?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          commission.property
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || commission.status === statusFilter;

        // Filter by date if dateFilter is set
        const matchesDate =
          !dateFilter || commission.date === format(dateFilter, "yyyy-MM-dd");

        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort((a, b) => {
        // Handle sorting
        if (sortColumn === "date") {
          return sortDirection === "asc"
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (
          sortColumn === "salePrice" ||
          sortColumn === "commission" ||
          sortColumn === "rate"
        ) {
          return sortDirection === "asc"
            ? parseFloat(a[sortColumn].toString()) -
                parseFloat(b[sortColumn].toString())
            : parseFloat(b[sortColumn].toString()) -
                parseFloat(a[sortColumn].toString());
        }
        if (
          sortColumn === "agent" ||
          sortColumn === "property" ||
          sortColumn === "status"
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
    commissions,
    searchQuery,
    statusFilter,
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

  // Calculate commission when sale price or rate changes
  React.useEffect(() => {
    if (newCommission.sale_price && newCommission.rate) {
      const salePrice = parseFloat(newCommission.sale_price);
      const rate = parseFloat(newCommission.rate);

      if (!isNaN(salePrice) && !isNaN(rate)) {
        const commission = salePrice * (rate / 100);
        setNewCommission((prev) => ({
          ...prev,
          commission: commission.toFixed(2),
        }));
      }
    }
  }, [newCommission.sale_price, newCommission.rate]);

  return (
    <div className={isRTL ? "rtl" : ""}>
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
              {t.commissions}
            </h1>
            <p className="text-muted-foreground">{t.commissionsOverview}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <LanguageSwitcher />
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {t.refresh}
            </Button>
            <Button
              onClick={() => setIsCommissionDialogOpen(true)}
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              {t.addCommission}
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {t.download}
            </Button>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t.totalCommissions}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">
                    ${stats.totalCommissions.toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t.averageCommission}
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">
                    ${stats.averageCommission.toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t.pendingCommissions}
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">
                    ${stats.pendingCommissions.toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t.averageRate}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stats.averageRate}%</div>
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
                placeholder={t.searchCommissions}
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
                    <span>{t.status}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.all}</SelectItem>
                  <SelectItem value="paid">{t.paid}</SelectItem>
                  <SelectItem value="pending">{t.pending}</SelectItem>
                  <SelectItem value="cancelled">{t.cancelled}</SelectItem>
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
                    {dateFilter ? format(dateFilter, "PPP") : t.filterByDate}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                  {dateFilter && (
                    <div className="p-3 border-t border-border">
                      <Button
                        variant="ghost"
                        className="w-full justify-center"
                        onClick={() => setDateFilter(undefined)}
                      >
                        {t.clearDate}
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </motion.div>

        {/* Commissions Table */}
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
                    onClick={() => handleSort("agent")}
                  >
                    <div className="flex items-center">
                      {t.agent} {getSortIcon("agent")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("property")}
                  >
                    <div className="flex items-center">
                      {t.property} {getSortIcon("property")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer w-[130px]"
                    onClick={() => handleSort("salePrice")}
                  >
                    <div className="flex items-center">
                      {t.salePrice} {getSortIcon("salePrice")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer w-[130px]"
                    onClick={() => handleSort("commission")}
                  >
                    <div className="flex items-center">
                      {t.commission} {getSortIcon("commission")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer w-[80px]"
                    onClick={() => handleSort("rate")}
                  >
                    <div className="flex items-center">
                      {t.rate} {getSortIcon("rate")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer w-[100px]"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      {t.status} {getSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer w-[110px]"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center">
                      {t.date} {getSortIcon("date")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      {t.noResults}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCommissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          {commission.agent}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Home className="mr-2 h-4 w-4 text-muted-foreground" />
                          {commission.property}
                        </div>
                      </TableCell>
                      <TableCell>
                        $
                        {typeof commission.salePrice === "number"
                          ? commission.salePrice.toLocaleString()
                          : parseFloat(
                              String(commission.salePrice)
                            ).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        $
                        {typeof commission.commission === "number"
                          ? commission.commission.toLocaleString()
                          : parseFloat(
                              String(commission.commission)
                            ).toLocaleString()}
                      </TableCell>
                      <TableCell>{commission.rate}%</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${statusColors[commission.status]?.bg} ${
                            statusColors[commission.status]?.text
                          } flex items-center`}
                        >
                          {statusColors[commission.status]?.icon}
                          {commission.status.charAt(0).toUpperCase() +
                            commission.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {commission.date}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className={isRTL ? "rtl" : ""}
                          >
                            <DropdownMenuLabel>{t.actions}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {commission.status === "pending" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateCommissionStatus(
                                    commission.id,
                                    "paid"
                                  )
                                }
                                className={
                                  isRTL ? "flex-row-reverse text-right" : ""
                                }
                              >
                                <CheckCircle2
                                  className={`${
                                    isRTL ? "ml-2" : "mr-2"
                                  } h-4 w-4 text-green-500`}
                                />
                                {t.paid}
                              </DropdownMenuItem>
                            )}
                            {commission.status === "pending" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateCommissionStatus(
                                    commission.id,
                                    "cancelled"
                                  )
                                }
                                className={
                                  isRTL ? "flex-row-reverse text-right" : ""
                                }
                              >
                                <XCircle
                                  className={`${
                                    isRTL ? "ml-2" : "mr-2"
                                  } h-4 w-4 text-red-500`}
                                />
                                {t.cancel}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className={
                                isRTL ? "flex-row-reverse text-right" : ""
                              }
                            >
                              <Eye
                                className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`}
                              />
                              {t.viewDetails}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </motion.div>

        {/* New Commission Dialog */}
        <Dialog
          open={isCommissionDialogOpen}
          onOpenChange={setIsCommissionDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t.addNewCommission}</DialogTitle>
              <DialogDescription>{t.addNewCommission}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="agent"
                  className="text-right text-sm font-medium"
                >
                  {t.agent}
                </label>
                <div className="col-span-3">
                  <Select
                    value={newCommission.agent_id}
                    onValueChange={(value) =>
                      setNewCommission({ ...newCommission, agent_id: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t.selectAgent} />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="property"
                  className="text-right text-sm font-medium"
                >
                  {t.property}
                </label>
                <div className="col-span-3">
                  <Select
                    value={newCommission.property_id}
                    onValueChange={(value) =>
                      setNewCommission({ ...newCommission, property_id: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t.selectProperty} />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="propertyAddress"
                  className="text-right text-sm font-medium"
                >
                  {t.manualProperty}
                </label>
                <Input
                  id="propertyAddress"
                  placeholder={t.manualProperty}
                  className="col-span-3"
                  value={newCommission.property_address}
                  onChange={(e) =>
                    setNewCommission({
                      ...newCommission,
                      property_address: e.target.value,
                    })
                  }
                  disabled={!!newCommission.property_id}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="salePrice"
                  className="text-right text-sm font-medium"
                >
                  {t.salePrice}
                </label>
                <div className="col-span-3">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input
                      id="salePrice"
                      type="number"
                      placeholder={t.enterSalePrice}
                      className="pl-7"
                      value={newCommission.sale_price}
                      onChange={(e) =>
                        setNewCommission({
                          ...newCommission,
                          sale_price: e.target.value,
                        })
                      }
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="rate"
                  className="text-right text-sm font-medium"
                >
                  {t.rate}
                </label>
                <div className="col-span-3">
                  <div className="relative">
                    <Input
                      id="rate"
                      type="number"
                      placeholder={t.enterRate}
                      className="pr-8"
                      value={newCommission.rate}
                      onChange={(e) =>
                        setNewCommission({
                          ...newCommission,
                          rate: e.target.value,
                        })
                      }
                      step="0.1"
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-3 top-2.5">%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="commission"
                  className="text-right text-sm font-medium"
                >
                  {t.commission}
                </label>
                <div className="col-span-3">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input
                      id="commission"
                      readOnly
                      className="pl-7 bg-muted"
                      value={newCommission.commission}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="status"
                  className="text-right text-sm font-medium"
                >
                  {t.status}
                </label>
                <div className="col-span-3">
                  <Select
                    value={newCommission.status}
                    onValueChange={(value) =>
                      setNewCommission({ ...newCommission, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectStatus} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{t.pending}</SelectItem>
                      <SelectItem value="paid">{t.paid}</SelectItem>
                      <SelectItem value="cancelled">{t.cancelled}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="date"
                  className="text-right text-sm font-medium"
                >
                  {t.date}
                </label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newCommission.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon
                          className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`}
                        />
                        {newCommission.date ? (
                          newCommission.date
                        ) : (
                          <span>{t.selectDate}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={
                          newCommission.date
                            ? new Date(newCommission.date)
                            : undefined
                        }
                        onSelect={(date) =>
                          setNewCommission({
                            ...newCommission,
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
            <DialogFooter className={isRTL ? "rtl-flex-row-reverse" : ""}>
              <Button
                variant="outline"
                onClick={() => setIsCommissionDialogOpen(false)}
              >
                {t.cancel}
              </Button>
              <Button onClick={handleCreateCommission}>{t.create}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
