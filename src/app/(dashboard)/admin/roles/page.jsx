"use client";

import * as React from "react";
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
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Edit,
  Trash2,
  Plus,
  ShieldPlus,
  ShieldCheck,
  Shield,
  CheckCircle2,
  Loader2,
  Search,
  UserCog,
  Users,
  RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

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

// Sample role data
const rolesData = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full access to all systems and data",
    permissionCount: 25,
    users: 2,
    isSystem: true,
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Property Admin",
    description: "Manage all property listings and approvals",
    permissionCount: 15,
    users: 5,
    isSystem: true,
    createdAt: "2023-02-20",
  },
  {
    id: "3",
    name: "User Admin",
    description: "User management capabilities",
    permissionCount: 10,
    users: 4,
    isSystem: true,
    createdAt: "2023-03-10",
  },
  {
    id: "4",
    name: "Senior Agent",
    description: "Advanced property and client management",
    permissionCount: 12,
    users: 12,
    isSystem: false,
    createdAt: "2023-04-05",
  },
  {
    id: "5",
    name: "Agent",
    description: "Standard property listing and client handling",
    permissionCount: 8,
    users: 25,
    isSystem: false,
    createdAt: "2023-05-12",
  },
  {
    id: "6",
    name: "Trainee",
    description: "Limited access for new employees",
    permissionCount: 4,
    users: 8,
    isSystem: false,
    createdAt: "2023-06-01",
  },
];

// Permission groups for the role creation form
const permissionGroups = [
  {
    name: "Properties",
    permissions: ["view", "create", "edit", "delete", "approve"],
  },
  {
    name: "Users",
    permissions: ["view", "create", "edit", "delete"],
  },
  {
    name: "Roles",
    permissions: ["view", "create", "edit", "delete"],
  },
  {
    name: "Settings",
    permissions: ["view", "edit"],
  },
];

export default function RolesPage() {
  const { toast } = useToast();
  const [roles, setRoles] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [deleteRoleId, setDeleteRoleId] = React.useState(null);
  const [editRoleId, setEditRoleId] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState("all");
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  // Form state for new role
  const [newRoleName, setNewRoleName] = React.useState("");
  const [newRoleDescription, setNewRoleDescription] = React.useState("");
  const [newRolePermissions, setNewRolePermissions] = React.useState({});

  // Load roles data
  React.useEffect(() => {
    const loadRoles = () => {
      setIsLoading(true);
      // Simulate API fetch
      setTimeout(() => {
        setRoles(rolesData);
        setIsLoading(false);
      }, 1500);
    };

    loadRoles();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    // Simulate API fetch
    setTimeout(() => {
      setRoles(rolesData);
      setIsRefreshing(false);
      toast({
        title: "Refreshed",
        description: "Role list has been updated",
        variant: "success",
      });
    }, 1000);
  };

  // Filter roles based on search and active tab
  const filteredRoles = React.useMemo(() => {
    return roles
      .filter((role) => {
        const matchesSearch =
          role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.description.toLowerCase().includes(searchQuery.toLowerCase());

        if (activeTab === "all") return matchesSearch;
        if (activeTab === "system") return matchesSearch && role.isSystem;
        if (activeTab === "custom") return matchesSearch && !role.isSystem;

        return matchesSearch;
      })
      .sort((a, b) => b.permissionCount - a.permissionCount);
  }, [roles, searchQuery, activeTab]);

  // Handle delete role
  const handleDeleteRole = (id) => {
    setRoles((prev) => prev.filter((role) => role.id !== id));
    setDeleteRoleId(null);
    toast({
      title: "Role deleted",
      description: "The role has been removed successfully",
      variant: "success",
    });
  };

  // Handle create role
  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      });
      return;
    }

    const newRole = {
      id: (roles.length + 1).toString(),
      name: newRoleName,
      description: newRoleDescription,
      permissionCount: Object.values(newRolePermissions).filter(Boolean).length,
      users: 0,
      isSystem: false,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setRoles((prev) => [...prev, newRole]);
    setShowCreateDialog(false);
    setNewRoleName("");
    setNewRoleDescription("");
    setNewRolePermissions({});
    toast({
      title: "Role created",
      description: `The role "${newRoleName}" has been created successfully`,
      variant: "success",
    });
  };

  // Handle permission change for new role
  const handlePermissionChange = (group, permission, checked) => {
    setNewRolePermissions((prev) => ({
      ...prev,
      [`${group.name.toLowerCase()}-${permission}`]: checked,
    }));
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
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            Create and manage user roles and their permissions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShieldPlus className="h-5 w-5 text-primary" />
                  Create New Role
                </DialogTitle>
                <DialogDescription>
                  Define a new role with specific permissions. Click save when
                  you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="e.g. Marketing Manager"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                    placeholder="Describe the purpose of this role"
                  />
                </div>
                <div className="space-y-4">
                  <Label>Permissions</Label>
                  <Tabs defaultValue="properties" className="w-full">
                    <TabsList className="grid grid-cols-4 mb-4">
                      {permissionGroups.map((group) => (
                        <TabsTrigger
                          key={group.name}
                          value={group.name.toLowerCase()}
                        >
                          {group.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {permissionGroups.map((group) => (
                      <TabsContent
                        key={group.name}
                        value={group.name.toLowerCase()}
                        className="space-y-4"
                      >
                        <div className="grid gap-2">
                          {group.permissions.map((permission) => (
                            <div
                              key={permission}
                              className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted/50"
                            >
                              <Checkbox
                                id={`new-${group.name.toLowerCase()}-${permission}`}
                                checked={
                                  newRolePermissions[
                                    `${group.name.toLowerCase()}-${permission}`
                                  ] || false
                                }
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    group,
                                    permission,
                                    checked
                                  )
                                }
                              />
                              <div className="space-y-1">
                                <Label
                                  htmlFor={`new-${group.name.toLowerCase()}-${permission}`}
                                  className="font-medium cursor-pointer"
                                >
                                  {permission.charAt(0).toUpperCase() +
                                    permission.slice(1)}{" "}
                                  {group.name}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {`Permission to ${permission} ${group.name.toLowerCase()}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateRole}>Create Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </motion.div>

      <motion.div variants={item} className="flex flex-col space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Roles
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search roles..."
                    className="pl-8 w-[180px] md:w-[260px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-3"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>All Roles</span>
                  {!isLoading && (
                    <Badge variant="outline" className="ml-1">
                      {roles.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>System</span>
                  {!isLoading && (
                    <Badge variant="outline" className="ml-1">
                      {roles.filter((r) => r.isSystem).length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="custom" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  <span>Custom</span>
                  {!isLoading && (
                    <Badge variant="outline" className="ml-1">
                      {roles.filter((r) => !r.isSystem).length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div key={i} variants={item}>
                      <Card className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full" />
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-2 gap-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Skeleton className="h-9 w-20" />
                          <Skeleton className="h-9 w-20" />
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : filteredRoles.length === 0 ? (
                <motion.div
                  key="empty"
                  variants={fadeIn}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">No roles found</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    {searchQuery
                      ? `No roles match "${searchQuery}"`
                      : "No roles available for the selected filter"}
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchQuery("")}
                      className="mt-2"
                    >
                      Clear Search
                    </Button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="roles-grid"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                  <AnimatePresence>
                    {filteredRoles.map((role) => (
                      <motion.div
                        key={role.id}
                        variants={item}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                      >
                        <Card className="overflow-hidden border-l-4 transition-colors hover:border-primary/70 hover:shadow-md">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg flex items-center">
                                {role.name}
                                {role.isSystem && (
                                  <Badge
                                    variant="secondary"
                                    className="ml-2 font-normal"
                                  >
                                    System
                                  </Badge>
                                )}
                              </CardTitle>
                            </div>
                            <CardDescription className="line-clamp-2">
                              {role.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-3">
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span>Permissions</span>
                              </div>
                              <span className="font-medium">
                                {role.permissionCount}
                              </span>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Users className="h-3.5 w-3.5" />
                                <span>Users</span>
                              </div>
                              <span className="font-medium">{role.users}</span>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditRoleId(role.id)}
                              className="gap-1 text-muted-foreground"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={role.isSystem}
                                  className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete role: {role.name}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the role and remove it
                                    from all users.
                                    {role.users > 0 && (
                                      <span className="font-medium text-destructive block mt-2">
                                        Warning: This role is assigned to{" "}
                                        {role.users} users!
                                      </span>
                                    )}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteRole(role.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between border-t p-6 gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredRoles.length} of {roles.length} roles
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Role
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Success notification for refresh */}
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
            <span className="text-sm font-medium">Refreshing roles...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
