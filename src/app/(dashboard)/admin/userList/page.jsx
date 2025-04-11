"use client";
import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  AlertCircle,
  ChevronDown,
  Download,
  Filter,
  Loader2,
  MoreHorizontal,
  Pencil,
  RefreshCcw,
  Search,
  Shield,
  Trash2,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { createClient } from "@/shared/utils/supabase/client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { UserActionsDropdown } from "./UserActionsDropdown";
import Roles from "@/app/auth/types/roles";
import { useToast } from "@/shared/hooks/use-toast";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Edit,
  Mail,
  EyeOff,
  CheckCircle,
  UserX,
  FolderClosed,
  FolderOpen,
  UserCog,
} from "lucide-react";

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
  show: {
    opacity: 1,
    transition: { duration: 0.4 },
  },
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("all");
  const [users, setUsers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("all");
  const supabase = createClient();
  const { toast } = useToast();
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [sortField, setSortField] = React.useState("name");
  const [sortDirection, setSortDirection] = React.useState("asc");
  const [showAddUserDialog, setShowAddUserDialog] = React.useState(false);
  const [newUser, setNewUser] = React.useState({
    name: "",
    email: "",
    role: "",
  });

  // Fetch all users from Supabase
  const fetchUsers = React.useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        // This requires admin privileges in Supabase
        const { data, error } = await supabase.rpc("get_all_users");

        if (error) {
          throw error;
        }

        setUsers(data || []);
        setIsError(false);

        if (isRefresh) {
          toast({
            title: "Refreshed",
            description: "User list has been updated",
            variant: "success",
          });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsError(true);
        toast({
          title: "Error fetching users",
          description:
            error.message ||
            "Could not load users. You might not have admin privileges.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [supabase, toast]
  );

  // Load users on component mount
  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on search query and role
  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      if (!user) return false;

      // Extract user metadata
      const username =
        user.user_metadata?.username || user.email?.split("@")[0] || "";
      const role = user.user_metadata?.role || "";
      const email = user.email || "";

      const searchableFields = [username, email, role].map((field) =>
        String(field).toLowerCase()
      );

      const searchWords = searchQuery.toLowerCase().split(" ").filter(Boolean);

      const searchMatch =
        searchWords.length === 0 ||
        searchWords.every((word) =>
          searchableFields.some((field) => field.includes(word))
        );

      const roleMatch =
        selectedRole === "all" ||
        role.toLowerCase() === selectedRole.toLowerCase();

      // Filter by active/inactive status if activeTab is set
      const activeMatch =
        activeTab === "all" ||
        (activeTab === "active" && user.last_sign_in_at) ||
        (activeTab === "inactive" && !user.last_sign_in_at);

      return searchMatch && roleMatch && activeMatch;
    });
  }, [users, searchQuery, selectedRole, activeTab]);

  // Helper function to count users by role
  const countByRole = (roleType) => {
    return users.filter(
      (user) =>
        user?.user_metadata?.role?.toLowerCase() === roleType.toLowerCase()
    ).length;
  };

  // Count active/inactive users
  const activeUsers = users.filter((user) => user.last_sign_in_at).length;
  const inactiveUsers = users.length - activeUsers;

  const handleRefresh = () => {
    fetchUsers(true);
  };

  // Render user card
  const renderUserCard = (user, index) => {
    if (!user) return null;

    const username =
      user.user_metadata?.username || user.email?.split("@")[0] || "User";
    const role = user.user_metadata?.role || "user";
    const userInitial = username ? username[0].toUpperCase() : "?";
    const lastActive = user.last_sign_in_at
      ? new Date(user.last_sign_in_at).toLocaleString()
      : "Never";

    return (
      <motion.div
        key={user.id}
        variants={item}
        layout
        transition={{
          layout: { type: "spring", stiffness: 200, damping: 25 },
        }}
      >
        <Card className="overflow-hidden border hover:shadow-md transition-shadow border-l-4 border-b-primary">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base ">
              <div className="flex items-center gap-2">
                <span>{username}</span>
                {role === "admin" && (
                  <Badge
                    variant="outline"
                    className="text-xs px-1.5 py-0 bg-red-100 text-red-800 border-red-200"
                  >
                    Admin
                  </Badge>
                )}
              </div>
              <UserActionsDropdown user={user} onRefresh={handleRefresh} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 rounded-full border">
                <AvatarImage src={user.user_metadata?.avatar} alt={username} />
                <AvatarFallback className="bg-slate-100 dark:bg-slate-700 text-center text-2xl">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.email}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground capitalize">
                    {role}
                  </p>
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      user.last_sign_in_at ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-xs text-muted-foreground">
                    {user.last_sign_in_at ? "active" : "inactive"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Last active: {lastActive}</p>
              <p>User ID: {user.id}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Export Import Dropdown
  const ExportImportDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden md:inline">Export / Import</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer flex gap-2">
          <Download className="h-4 w-4" />
          Export Users
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex gap-2">
          <Upload className="h-4 w-4" />
          Import Users
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Filter Section
  const FilterSection = () => (
    <div className="flex items-center gap-2">
      <Label htmlFor="role-select" className="hidden md:flex text-sm">
        Filter by:
      </Label>
      <Select value={selectedRole} onValueChange={setSelectedRole}>
        <SelectTrigger className="w-[180px]" id="role-select">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="agent">Agent</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  // Search Section
  const SearchSection = () => (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search users..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );

  // User Card Skeleton
  const UserCardSkeleton = () => (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      </CardContent>
    </Card>
  );

  // Error State
  const ErrorState = () => (
    <motion.div
      className="flex flex-col items-center justify-center p-12 text-center"
      variants={fadeIn}
      initial="hidden"
      animate="show"
    >
      <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">Failed to load users</h3>
      <p className="mb-6 text-muted-foreground">
        There was an error retrieving user data. You may not have sufficient
        permissions.
      </p>
      <Button onClick={handleRefresh} className="gap-2" disabled={isRefreshing}>
        {isRefreshing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
        Try Again
      </Button>
    </motion.div>
  );

  // Empty State
  const EmptyState = () => (
    <motion.div
      className="flex flex-col items-center justify-center p-12 text-center"
      variants={fadeIn}
      initial="hidden"
      animate="show"
    >
      <div className="mb-4 rounded-full bg-muted p-3 text-muted-foreground">
        <Users className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">No users found</h3>
      <p className="mb-6 text-muted-foreground">
        {searchQuery || selectedRole !== "all"
          ? "Try adjusting your search or filter criteria."
          : "Start by adding your first user."}
      </p>
      <Button className="gap-2">
        <UserPlus className="h-4 w-4" />
        Add New User
      </Button>
    </motion.div>
  );

  // Status Counts
  const StatusCounts = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <motion.div variants={item}>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <h3 className="text-muted-foreground mb-1">Total Users</h3>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{users.length}</p>
              <Users className="h-8 w-8 text-blue-500 bg-blue-50 p-1 rounded-md" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <h3 className="text-muted-foreground mb-1">Active Users</h3>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{activeUsers}</p>
              <div className="h-8 w-8 bg-green-50 p-1 rounded-md flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <h3 className="text-muted-foreground mb-1">Inactive Users</h3>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{inactiveUsers}</p>
              <div className="h-8 w-8 bg-red-50 p-1 rounded-md flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle user selection
  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Handle select all users
  const handleSelectAllUsers = (checked) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Handle user status change
  const handleStatusChange = (userId, newStatus) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );

    toast({
      title: "Status updated",
      description: `User status changed to ${newStatus}`,
      variant: "success",
    });
  };

  // Handle user deletion
  const handleDeleteUser = (userId) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    setSelectedUsers((prev) => prev.filter((id) => id !== userId));

    toast({
      title: "User deleted",
      description: "The user has been removed successfully",
      variant: "success",
    });
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);

    toast({
      title: "Users deleted",
      description: `${selectedUsers.length} users have been removed`,
      variant: "success",
    });
  };

  // Handle add user
  const handleAddUser = () => {
    // Validate form
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Create new user
    const user = {
      id: (users.length + 1).toString(),
      name: newUser.name,
      email: newUser.email,
      role: selectedRole === "all" ? newUser.role : selectedRole,
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: "-",
      properties: 0,
    };

    setUsers((prev) => [...prev, user]);
    setShowAddUserDialog(false);
    setNewUser({ name: "", email: "", role: "" });

    toast({
      title: "User created",
      description: `${user.name} has been added successfully`,
      variant: "success",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="success" className="capitalize">
            <CheckCircle className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="secondary" className="capitalize">
            <EyeOff className="mr-1 h-3 w-3" />
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="capitalize">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Pending
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="destructive" className="capitalize">
            <UserX className="mr-1 h-3 w-3" />
            Suspended
          </Badge>
        );
      default:
        return <Badge className="capitalize">{status}</Badge>;
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="flex flex-col gap-4 md:flex-row md:items-center justify-between"
        variants={item}
      >
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            <span className="hidden md:inline">Refresh</span>
          </Button>
          <ExportImportDropdown />
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden md:inline">Add User</span>
          </Button>
        </div>
      </motion.div>

      {!isLoading && !isError && users.length > 0 && (
        <motion.div variants={item}>
          <StatusCounts />
        </motion.div>
      )}

      <motion.div variants={item}>
        <Card className="p-4 border">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <SearchSection />
            <FilterSection />
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className=""
          >
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <UserCardSkeleton key={i} />
                  ))}
              </motion.div>
            ) : isError ? (
              <ErrorState />
            ) : filteredUsers.length === 0 ? (
              <EmptyState />
            ) : (
              <motion.div
                key="userlist"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence>
                  {filteredUsers.map((user, index) =>
                    renderUserCard(user, index)
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Floating refresh indicator */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            className="fixed bottom-6 right-6 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-3 shadow-lg flex items-center space-x-3 z-50 rounded-lg border border-primary/20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Refreshing user data...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
