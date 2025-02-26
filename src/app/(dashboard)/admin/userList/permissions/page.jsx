"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
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

export default function PermissionsPage() {
  const [selectedRole, setSelectedRole] = React.useState(roles[0]);
  const [permissions, setPermissions] = React.useState(() => {
    const initialPermissions = {};
    permissionGroups.forEach((group) => {
      group.permissions.forEach((permission) => {
        initialPermissions[`${group.name.toLowerCase()}-${permission}`] = true;
      });
    });
    return initialPermissions;
  });

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div className="flex flex-col "> 
        <h1 className="text-3xl font-bold">Permissions Management</h1>
        <p className="text-muted-foreground">
          Configure permissions for different roles
        </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
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

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>
              <Key className="mr-2 h-5 w-5" /> Permissions for{" "}
              {formatRoleName(selectedRole)}
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
                            ]
                          }
                          onChange={(e) =>
                            handlePermissionChange(
                              group,
                              permission,
                              e.target.checked
                            )
                          }
                        />
                        <Label
                          htmlFor={`${group.name.toLowerCase()}-${permission}`}
                        >
                          {permission.charAt(0).toUpperCase() +
                            permission.slice(1)}{" "}
                          {group.name.slice(0, -1)}
                        </Label>{" "}
                        {/* Add space and singularize group name */}
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
        <Button className="w-full md:w-auto">
          <Save className="mr-2 h-4 w-4" />
          Save Permissions
        </Button>
      </div>
    </div>
  );
}
