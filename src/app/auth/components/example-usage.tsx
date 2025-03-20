"use client";

import { useAuth } from "@/app/auth/hooks/useAuth";
import { UpdateRoleForm, AdminUpdateRoleForm } from "./UpdateRoleForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import Roles from "../types/roles";
import { useRole } from "../hooks/useRole";

export default function RoleManagementExample() {
  const { user } = useAuth();
  const currentRole = useRole();

  if (!user) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>User not logged in</CardTitle>
            <CardDescription>
              Please log in to access role management features
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Role Management</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Self update component for all users */}
        <div>
          <UpdateRoleForm className="h-full" />
        </div>

        {/* Account information */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Your Account</CardTitle>
            <CardDescription>Your current session information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">User ID:</p>
              <p className="text-sm text-muted-foreground break-all">
                {user.id}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Email:</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Current Role:</p>
              <p className="text-sm text-muted-foreground">
                {user.user_metadata?.role || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Role from Hook:</p>
              <p className="text-sm text-muted-foreground">{currentRole}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin section - only visible to admins */}
      {currentRole === Roles.ADMIN && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Admin Controls</h2>
          <p className="mb-6">
            As an admin, you can update other users roles:
          </p>

          <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Update User Role</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Enter the user ID to update their role. You&apos;ll need to
              create a PostgreSQL function in Supabase that allows admins to
              update other users&apos; roles.
            </p>

            {/* This assumes you have an AdminUpdateRoleForm component */}
            <AdminUpdateRoleForm
              userId="example-user-id-here"
              className="mt-4"
            />
          </div>
        </div>
      )}
    </div>
  );
}
