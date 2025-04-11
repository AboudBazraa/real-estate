"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Key,
  Save,
  Check,
  Loader2,
  Lock,
  ShieldCheck,
  AlertOctagon,
} from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/shared/components/ui/badge";

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

// Static data
const roles = [
  "super-admin",
  "property-admin",
  "user-admin",
  "senior-agent",
  "agent",
  "junior-agent",
  "trainee",
];

const permissionGroups = [
  {
    name: "Properties",
    permissions: ["view", "create", "edit", "delete", "approve"],
    icon: <Key className="h-4 w-4" />,
  },
  {
    name: "Users",
    permissions: ["view", "create", "edit", "delete"],
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    name: "Roles",
    permissions: ["view", "create", "edit", "delete"],
    icon: <Lock className="h-4 w-4" />,
  },
  {
    name: "Settings",
    permissions: ["view", "edit"],
    icon: <AlertOctagon className="h-4 w-4" />,
  },
];

// Static permission presets for each role
const rolePermissions = {
  "super-admin": {
    "properties-view": true,
    "properties-create": true,
    "properties-edit": true,
    "properties-delete": true,
    "properties-approve": true,
    "users-view": true,
    "users-create": true,
    "users-edit": true,
    "users-delete": true,
    "roles-view": true,
    "roles-create": true,
    "roles-edit": true,
    "roles-delete": true,
    "settings-view": true,
    "settings-edit": true,
  },
  "property-admin": {
    "properties-view": true,
    "properties-create": true,
    "properties-edit": true,
    "properties-delete": false,
    "properties-approve": true,
    "users-view": true,
    "users-create": false,
    "users-edit": false,
    "users-delete": false,
    "roles-view": false,
    "roles-create": false,
    "roles-edit": false,
    "roles-delete": false,
    "settings-view": true,
    "settings-edit": false,
  },
  // Add more role presets as needed
};

export default function PermissionsPage() {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = React.useState(roles[0]);
  const [permissions, setPermissions] = React.useState(
    rolePermissions[roles[0]]
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [initialLoad, setInitialLoad] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("properties");
  const [unsavedChanges, setUnsavedChanges] = React.useState(false);

  // Simulate initial loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Update permissions when role changes
  React.useEffect(() => {
    setIsLoading(true);

    // Simulate API call to get role permissions
    setTimeout(() => {
      setPermissions(rolePermissions[selectedRole] || {});
      setIsLoading(false);
      setUnsavedChanges(false);
    }, 500);
  }, [selectedRole]);

  const handlePermissionChange = (group, permission, checked) => {
    setPermissions((prev) => ({
      ...prev,
      [`${group.name.toLowerCase()}-${permission}`]: checked,
    }));
    setUnsavedChanges(true);
  };

  const formatRoleName = (role) =>
    role
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Saved permissions:", {
        role: selectedRole,
        permissions: permissions,
      });

      toast({
        variant: "success",
        title: "Success",
        description: `Permissions for ${formatRoleName(
          selectedRole
        )} have been updated`,
      });

      setIsSaving(false);
      setUnsavedChanges(false);
    }, 1000);
  };

  // Permission card skeleton for loading state
  const PermissionCardSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-6 w-1/3" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start space-x-2">
            <Skeleton className="h-4 w-4 mt-0.5" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const countPermissions = (permissions) => {
    return Object.entries(permissions).filter(([_, value]) => value).length;
  };

  return (
    <motion.div
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Permissions Management</h1>
          <p className="text-muted-foreground">
            Configure permissions for different roles
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || !unsavedChanges || isLoading || initialLoad}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Role Selector Card */}
        <motion.div variants={item} className="col-span-1">
          <Card className="md:col-span-1 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Select Role
              </CardTitle>
              <CardDescription>
                Choose a role to edit permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
                disabled={initialLoad}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {formatRoleName(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {!initialLoad && !isLoading && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Role Summary:</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Permissions:
                      </span>
                      <Badge variant="outline" className="font-normal">
                        {countPermissions(permissions)}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge className="bg-blue-100 text-blue-800 border-none">
                        {selectedRole.includes("admin") ? "Admin" : "User"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Permissions Card */}
        <motion.div variants={item} className="col-span-3">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-2 h-5 w-5 text-primary" />
                Permissions for {formatRoleName(selectedRole)}
              </CardTitle>
              <CardDescription>
                Configure what this role can do in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {initialLoad ? (
                  <motion.div
                    key="initial-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <PermissionCardSkeleton />
                  </motion.div>
                ) : (
                  <motion.div
                    key="permissions-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="space-y-6"
                    >
                      <TabsList className="grid grid-cols-4 w-full">
                        {permissionGroups.map((group) => (
                          <TabsTrigger
                            key={group.name}
                            value={group.name.toLowerCase()}
                            className="flex items-center gap-1"
                            disabled={isLoading}
                          >
                            <span className="hidden md:inline-flex items-center gap-1">
                              {group.icon}
                              {group.name}
                            </span>
                            <span className="md:hidden">{group.icon}</span>
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <PermissionCardSkeleton />
                          </motion.div>
                        ) : (
                          permissionGroups.map((group) => (
                            <TabsContent
                              key={group.name}
                              value={group.name.toLowerCase()}
                            >
                              <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="space-y-6 rounded-md border p-4"
                              >
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-medium flex items-center gap-2">
                                    {group.icon}
                                    {group.name} Permissions
                                  </h3>
                                  <Badge
                                    variant={
                                      selectedRole.includes("admin")
                                        ? "default"
                                        : "outline"
                                    }
                                  >
                                    {selectedRole.includes("admin")
                                      ? "Admin Access"
                                      : "Limited Access"}
                                  </Badge>
                                </div>
                                <div className="space-y-4">
                                  {group.permissions.map((permission) => {
                                    const id = `${group.name.toLowerCase()}-${permission}`;
                                    const isChecked = permissions[id];

                                    return (
                                      <motion.div
                                        key={id}
                                        variants={item}
                                        className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                                      >
                                        <Checkbox
                                          id={id}
                                          checked={isChecked}
                                          onCheckedChange={(checked) =>
                                            handlePermissionChange(
                                              group,
                                              permission,
                                              checked
                                            )
                                          }
                                          className="mt-1"
                                        />
                                        <div className="space-y-1">
                                          <Label
                                            htmlFor={id}
                                            className="text-base font-medium capitalize cursor-pointer"
                                          >
                                            {permission} {group.name}
                                          </Label>
                                          <p className="text-sm text-muted-foreground">
                                            {getPermissionDescription(
                                              group.name,
                                              permission
                                            )}
                                          </p>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            </TabsContent>
                          ))
                        )}
                      </AnimatePresence>
                    </Tabs>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                {unsavedChanges
                  ? "You have unsaved changes"
                  : "No unsaved changes"}
              </p>
              <Button
                onClick={handleSave}
                disabled={
                  isSaving || !unsavedChanges || isLoading || initialLoad
                }
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Floating save successful indicator */}
      <AnimatePresence>
        {isSaving && (
          <motion.div
            className="fixed bottom-6 right-6 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-3 shadow-lg flex items-center space-x-3 z-50 rounded-lg border border-primary/20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Saving permissions...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Helper function to generate descriptions for permissions
function getPermissionDescription(group, permission) {
  const descriptions = {
    Properties: {
      view: "View property listings and details",
      create: "Create new property listings",
      edit: "Modify existing property details",
      delete: "Remove property listings from the system",
      approve: "Review and approve property submissions",
    },
    Users: {
      view: "Access user profiles and information",
      create: "Add new users to the system",
      edit: "Modify user details and profiles",
      delete: "Remove users from the system",
    },
    Roles: {
      view: "View role configurations",
      create: "Create new roles in the system",
      edit: "Modify existing role permissions",
      delete: "Remove roles from the system",
    },
    Settings: {
      view: "View system configuration settings",
      edit: "Modify system preferences and settings",
    },
  };

  return (
    descriptions[group]?.[permission] ||
    `Permission to ${permission} ${group.toLowerCase()}`
  );
}
