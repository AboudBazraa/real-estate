"use client";

import { useState } from "react";
import { useUpdateUserRole } from "@/app/auth/hooks/useUpdateUserRole";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import Roles from "@/app/auth/types/roles";
import { useAuth } from "../hooks/useAuth";

interface UpdateRoleFormProps {
  className?: string;
}

export function UpdateRoleForm({ className }: UpdateRoleFormProps) {
  const { user } = useAuth();
  const { updateCurrentUserRole, isUpdating } = useUpdateUserRole();
  const [selectedRole, setSelectedRole] = useState<Roles | null>(
    (user?.user_metadata?.role as Roles) || null
  );

  const handleRoleChange = (value: string) => {
    setSelectedRole(value as Roles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      await updateCurrentUserRole(selectedRole);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Update Your Role</CardTitle>
        <CardDescription>
          Change your account role to access different features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Select Role
            </label>
            <Select
              value={selectedRole || undefined}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Roles.USER}>User</SelectItem>
                <SelectItem value={Roles.AGENT}>Agent</SelectItem>
                <SelectItem value={Roles.ADMIN}>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isUpdating || !selectedRole}>
            {isUpdating ? "Updating..." : "Update Role"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <p>Current role: {user?.user_metadata?.role || "Not set"}</p>
      </CardFooter>
    </Card>
  );
}

// Admin component to update other users' roles
export function AdminUpdateRoleForm({
  userId,
  className,
}: {
  userId: string;
  className?: string;
}) {
  const { updateUserRole, isUpdating } = useUpdateUserRole();
  const [selectedRole, setSelectedRole] = useState<Roles | null>(null);

  const handleRoleChange = (value: string) => {
    setSelectedRole(value as Roles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      await updateUserRole(userId, selectedRole);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Update User Role</CardTitle>
        <CardDescription>Change the role for user ID: {userId}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Select Role
            </label>
            <Select
              value={selectedRole || undefined}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Roles.USER}>User</SelectItem>
                <SelectItem value={Roles.AGENT}>Agent</SelectItem>
                <SelectItem value={Roles.ADMIN}>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isUpdating || !selectedRole}>
            {isUpdating ? "Updating..." : "Update Role"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
