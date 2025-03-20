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
  ChevronDown,
  Download,
  Filter,
  MoreHorizontal,
  Pencil,
  Search,
  Shield,
  Trash2,
  Upload,
  UserPlus,
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

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("all");
  const [users, setUsers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  // Fetch all users from Supabase
  const fetchUsers = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // This requires admin privileges in Supabase
      const { data, error } = await supabase.rpc("get_all_users");

      if (error) {
        throw error;
      }

      setUsers(data || []);
      setIsError(false);
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
    }
  }, [supabase, toast]);

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

      return searchMatch && roleMatch;
    });
  }, [users, searchQuery, selectedRole]);

  // Helper function to count users by role
  const countByRole = (roleType) => {
    return users.filter(
      (user) =>
        user?.user_metadata?.role?.toLowerCase() === roleType.toLowerCase()
    ).length;
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  // Render user card
  const renderUserCard = (user) => {
    if (!user) return null;

    const username =
      user.user_metadata?.username || user.email?.split("@")[0] || "User";
    const role = user.user_metadata?.role || "user";
    const userInitial = username ? username[0].toUpperCase() : "?";
    const lastActive = user.last_sign_in_at
      ? new Date(user.last_sign_in_at).toLocaleString()
      : "Never";

    return (
      <Card key={user.id} className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-base">
            <span>{username}</span>
            <UserActionsDropdown user={user} onRefresh={handleRefresh} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 rounded-full">
              <AvatarImage src={user.user_metadata?.avatar} alt={username} />
              <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-center text-2xl">
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
    );
  };

  // Export and Import dropdown
  const ExportImportDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Upload className="mr-2 h-4 w-4" />
          Import Users
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Filter section
  const FilterSection = () => (
    <div className="flex items-center gap-2">
      <Label htmlFor="role-filter" className="sr-only">
        Filter by role
      </Label>
      <Select value={selectedRole} onValueChange={setSelectedRole}>
        <SelectTrigger id="role-filter" className="h-8 w-[150px] flex gap-1">
          <Filter className="h-3.5 w-3.5" />
          <span>Role: {selectedRole}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value={Roles.ADMIN}>Admin</SelectItem>
          <SelectItem value={Roles.AGENT}>Agent</SelectItem>
          <SelectItem value={Roles.USER}>User</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  // Search section
  const SearchSection = () => (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search users..."
        className="w-full bg-background pl-8 text-sm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );

  return (
    <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Users</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Tabs defaultValue="all" className="h-full">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-4">
            <TabsTrigger value="all" className="px-4">
              All Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="admin" className="px-4">
              Admins ({countByRole(Roles.ADMIN)})
            </TabsTrigger>
            <TabsTrigger value="agent" className="px-4">
              Agents ({countByRole(Roles.AGENT)})
            </TabsTrigger>
            <TabsTrigger value="user" className="px-4">
              Users ({countByRole(Roles.USER)})
            </TabsTrigger>
          </TabsList>
          <ExportImportDropdown />
        </div>

        <div className="mt-4 flex flex-col gap-4 md:flex-row">
          <SearchSection />
          <FilterSection />
        </div>

        <TabsContent
          value="all"
          className="h-full flex-1 data-[state=active]:flex data-[state=active]:flex-col"
        >
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <p>Loading users...</p>
            </div>
          ) : isError ? (
            <div className="flex h-40 items-center justify-center">
              <p>Error loading users. Please try again.</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <p>No users found.</p>
            </div>
          ) : (
            <div className="grid gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => renderUserCard(user))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="admin">
          <div className="grid gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers
              .filter((user) => user?.user_metadata?.role === Roles.ADMIN)
              .map((user) => renderUserCard(user))}
          </div>
        </TabsContent>

        <TabsContent value="agent">
          <div className="grid gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers
              .filter((user) => user?.user_metadata?.role === Roles.AGENT)
              .map((user) => renderUserCard(user))}
          </div>
        </TabsContent>

        <TabsContent value="user">
          <div className="grid gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers
              .filter((user) => user?.user_metadata?.role === Roles.USER)
              .map((user) => renderUserCard(user))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
