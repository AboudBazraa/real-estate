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
import { Key, Save } from "lucide-react";

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
  const [permissions, setPermissions] = React.useState(rolePermissions[roles[0]]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Update permissions when role changes
  React.useEffect(() => {
    setPermissions(rolePermissions[selectedRole] || {});
  }, [selectedRole]);

  const handlePermissionChange = (group, permission, checked) => {
    setPermissions((prev) => ({
      ...prev,
      [`${group.name.toLowerCase()}-${permission}`]: checked,
    }));
  };

  const formatRoleName = (role) =>
    role
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Saved permissions:", {
        role: selectedRole,
        permissions: permissions,
      });
      
      toast({
        variant: "success",
        title: "Success",
        description: `Permissions for ${formatRoleName(selectedRole)} have been updated`,
      });
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Permissions Management</h1>
          <p className="text-muted-foreground">
            Configure permissions for different roles
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Role Selector Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Role</CardTitle>
            <CardDescription>Choose a role to edit permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
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
          </CardContent>
        </Card>

        {/* Permissions Card */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="mr-2 h-5 w-5" />
              Permissions for {formatRoleName(selectedRole)}
            </CardTitle>
            <CardDescription>
              Configure what this role can do in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="properties" className="space-y-4">
              <TabsList>
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
                  <div className="grid gap-4 md:grid-cols-2">
                    {group.permissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`${group.name.toLowerCase()}-${permission}`}
                          checked={
                            permissions[
                              `${group.name.toLowerCase()}-${permission}`
                            ] || false
                          }
                          onCheckedChange={(checked) =>
                            handlePermissionChange(group, permission, checked)
                          }
                        />
                        <Label
                          htmlFor={`${group.name.toLowerCase()}-${permission}`}
                        >
                          {permission.charAt(0).toUpperCase() +
                            permission.slice(1)}{" "}
                          {group.name.slice(0, -1)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full md:w-auto"
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Saving..." : "Save Permissions"}
        </Button>
      </div>
    </div>
  );
}
