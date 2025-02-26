"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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

const users = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Admin",
    status: "active",
    lastActive: "2 hours ago",
    permissions: ["Full Access"],
    avatar: "",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "Senior Agent",
    status: "active",
    lastActive: "5 minutes ago",
    permissions: ["Create", "Edit", "Delete", "Approve"],
    avatar: "",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.c@example.com",
    role: "Agent",
    status: "active",
    lastActive: "1 day ago",
    permissions: ["Create", "Edit"],
    avatar: "",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    role: "Agent",
    status: "inactive",
    lastActive: "2 weeks ago",
    permissions: ["Create", "Edit"],
    avatar: "",
  },
  {
    id: 5,
    name: "David Kim",
    email: "david.k@example.com",
    role: "Client",
    status: "active",
    lastActive: "3 days ago",
    permissions: ["View"],
    avatar: "",
  },
  {
    id: 6,
    name: "Jessica Lee",
    email: "jessica.l@example.com",
    role: "Admin",
    status: "active",
    lastActive: "1 hour ago",
    permissions: ["Full Access"],
    avatar: "",
  },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  //   const [isAddUserOpen, setIsAddUserOpen] = React.useState(false);

  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const searchMatch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase());

      const roleMatch =
        selectedRole === "all" ||
        user.role.toLowerCase() === selectedRole.toLowerCase();

      const statusMatch =
        selectedStatus === "all" || user.status === selectedStatus;

      return searchMatch && roleMatch && statusMatch;
    });
  }, [searchQuery, selectedRole, selectedStatus]);

  const renderUserCard = (user) => (
    <Card key={user.id}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span>{user.name}</span>
          <UserActionsDropdown userId={user.id} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {user.avatar && (
            <img
              src={user.avatar}
              className="h-12 w-12 rounded-full object-cover bg-muted bg-slate-700"
            />
          )}
          {!user.avatar && (
            <p className="h-12 w-12 rounded-full object-cover bg-muted bg-slate-300 dark:bg-slate-700 text-center text-2xl flex justify-center items-center">
              {user.name.slice(0, 2)}
            </p>
          )}
          <div>
            <p className="font-medium">{user.email}</p>
            <UserStatus
              role={user.role}
              status={user.status}
              lastActive={user.lastActive}
            />
          </div>
        </div>
        <UserPermissions permissions={user.permissions} />
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <CardActions userId={user.id} />
      </CardFooter>
    </Card>
  );

  const UserActionsDropdown = ({ userId }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>
          <Pencil className="mr-2 h-4 w-4" />
          Edit User
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Shield className="mr-2 h-4 w-4" />
          Manage Permissions
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const UserStatus = ({ role, status, lastActive }) => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{role}</span>
      <div
        className={`h-1.5 w-1.5 rounded-full ${
          status === "active" ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
      <span className="text-xs capitalize text-muted-foreground">{status}</span>
    </div>
  );

  const UserPermissions = ({ permissions }) => (
    <div className="mt-4">
      <p className="text-xs font-medium mb-1">Permissions:</p>
      <div className="flex flex-wrap gap-1">
        {permissions.map((permission, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold"
          >
            {permission}
          </span>
        ))}
      </div>
    </div>
  );

  const CardActions = ({ userId }) => (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="flex-1">
        Edit
      </Button>
      <Button variant="outline" size="sm" className="flex-1">
        Permissions
      </Button>
    </div>
  );

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

  const FilterSection = () => (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="senior agent">Senior Agent</SelectItem>
            <SelectItem value="agent">Agent</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage users and their access to the system
          </p>
        </div>
        <div className="flex gap-2">
          {/* <AddUserDialog isOpen={isAddUserOpen} setIsOpen={setIsAddUserOpen} /> */}
          <ExportImportDropdown />
        </div>
      </div>

      <FilterSection />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
          <TabsTrigger value="admins">
            Admins ({users.filter((u) => u.role === "Admin").length})
          </TabsTrigger>
          <TabsTrigger value="agents">
            Agents ({users.filter((u) => u.role.includes("Agent")).length})
          </TabsTrigger>
          <TabsTrigger value="clients">
            Clients ({users.filter((u) => u.role === "Client").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {filteredUsers.map(renderUserCard)}
          </div>
        </TabsContent>

        <TabsContent value="admins" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {filteredUsers
              .filter((user) => user.role === "Admin")
              .map(renderUserCard)}
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {filteredUsers
              .filter((user) => user.role.includes("Agent"))
              .map(renderUserCard)}
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {filteredUsers
              .filter((user) => user.role === "Client")
              .map(renderUserCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
