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
import { useApiQuery, useApiMutation } from "@/shared/hooks/useApi";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogOverlay,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { renderUserCard } from "./renderUserCard";
import { UserActionsDropdown } from "./UserActionsDropdown";

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

const initialUserState = { id: null, username: "", email: "", role: "" };

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState(initialUserState);

  const { data, isPending, isError, error } = useApiQuery(["users"], {
    url: "/User/GetAll",
  });

  // Convert data to array and handle undefined/null cases
  const users = React.useMemo(() => {
    if (!data) return [];
    return Array.isArray(data)
      ? data
      : Array.isArray(data.data)
      ? data.data
      : Array.isArray(data.users)
      ? data.users
      : [];
  }, [data]);
  // console.log(users.id);

  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      if (!user) return false;

      const searchableFields = [
        user.username || "",
        user.email || "",
        user.role || "",
      ].map((field) => String(field).toLowerCase());

      const searchWords = searchQuery.toLowerCase().split(" ").filter(Boolean);

      const searchMatch =
        searchWords.length === 0 ||
        searchWords.every((word) =>
          searchableFields.some((field) => field.includes(word))
        );
      const roleMatch =
        selectedRole === "all" ||
        (user.role || "").toLowerCase() === selectedRole.toLowerCase();

      return searchMatch && roleMatch;
    });
  }, [users, searchQuery, selectedRole]);

  // Helper functions for counting users by role
  const countByRole = (roleType) => {
    return users.filter((user) => user?.role === roleType).length;
  };

  // Function to handle closing the modal
  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingUser(initialUserState);
  };

  // Function to handle role update

  const roleMapping = {
    admin: 0,
    agent: 1,
    user: 2,
  };

  const handleRoleChange = (value) => {
    setEditingUser((prev) => ({ ...prev, role: value })); // Update the editingUser state
  };

  // const UserStatus = ({ role, status, lastActive }) => (
  //   <div className="flex items-center gap-2">
  //     <span className="text-sm text-muted-foreground">{role}</span>
  //     <div
  //       className={`h-1.5 w-1.5 rounded-full ${
  //         status === "active" ? "bg-green-500" : "bg-red-500"
  //       }`}
  //     ></div>
  //     <span className="text-xs capitalize text-muted-foreground">{status}</span>
  //   </div>
  // );

  // const UserPermissions = ({ permissions }) => (
  //   <div className="mt-4">
  //     <p className="text-xs font-medium mb-1">Permissions:</p>
  //     <div className="flex flex-wrap gap-1">
  //       {permissions.map((permission, i) => (
  //         <span
  //           key={i}
  //           className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold"
  //         >
  //           {permission}
  //         </span>
  //       ))}
  //     </div>
  //   </div>
  // );

  // const CardActions = ({ userId }) => (
  //   <div className="flex gap-2">
  //     <Button variant="outline" size="sm" className="flex-1">
  //       Edit
  //     </Button>
  //     <Button variant="outline" size="sm" className="flex-1">
  //       Permissions
  //     </Button>
  //   </div>
  // );

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
          type="text"
          placeholder="Search users..."
          className="pl-8"
          value={searchQuery}
          onChange={() => setSearchQuery(e.target.value)}
          autoComplete="off"
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
          <ExportImportDropdown />
        </div>
      </div>

      <FilterSection />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
          <TabsTrigger value="admins">
            Admins ({countByRole("Admin")})
          </TabsTrigger>
          <TabsTrigger value="agents">
            Agents ({countByRole("Agent")})
          </TabsTrigger>
          <TabsTrigger value="users">Users ({countByRole("User")})</TabsTrigger>
        </TabsList>

        {isPending ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-destructive">Error: {error?.message}</p>
          </div>
        ) : (
          <>
            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {filteredUsers.map((user) => renderUserCard(user))}
              </div>
            </TabsContent>

            <TabsContent value="admins" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {filteredUsers
                  .filter((user) => user?.role === "Admin")
                  .map(renderUserCard)}
              </div>
            </TabsContent>

            <TabsContent value="agents" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {filteredUsers
                  .filter((user) => user?.role === "Agent")
                  .map(renderUserCard)}
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {filteredUsers
                  .filter((user) => user?.role === "User")
                  .map(renderUserCard)}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
      {/* <Dialog open={isModalOpen} onOpenChange={closeEditModal}>
        <DialogOverlay className="fixed inset-0 bg-black opacity-30" />
        <DialogContent className="p-4">
          <DialogTitle className="text-lg font-bold">Edit User</DialogTitle>
          <div className="flex flex-col space-y-4">
            <Input
              label="Username"
              value={editingUser.username || ""}
              onChange={(e) =>
                setEditingUser({ ...editingUser, username: e.target.value })
              }
              placeholder="Enter username"
            />
            <Input
              label="Email"
              value={editingUser.email || ""}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
              placeholder="Enter email"
            />
            <Select
              value={editingUser.role || ""}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingUser.id) {
                  updateUserRole(editingUser.id, editingUser.role);
                } else {
                  console.error("User ID is undefined");
                }
                closeEditModal();
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
