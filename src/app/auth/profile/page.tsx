"use client";

import { useAuth } from "@/app/auth/hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { UpdateRoleForm } from "@/app/auth/components/UpdateRoleForm";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useRole } from "../hooks/useRole";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const currentRole = useRole();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  // Get user details
  const username =
    user.user_metadata?.username || user.email?.split("@")[0] || "User";
  const role = user.user_metadata?.role || "user";
  const userInitial = username ? username[0].toUpperCase() : "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container max-w-4xl mx-auto py-12 px-4"
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.user_metadata?.avatar} alt={username} />
          <AvatarFallback className="text-2xl">{userInitial}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{username}</h1>
          <p className="text-muted-foreground">
            {user.email} · {role.charAt(0).toUpperCase() + role.slice(1)}
          </p>
        </div>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="role">Role Management</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                View and manage your account details
              </CardDescription>
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
                <p className="text-sm font-medium">Username:</p>
                <p className="text-sm text-muted-foreground">{username}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Sign In:</p>
                <p className="text-sm text-muted-foreground">
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString()
                    : "Never"}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={handleLogout}>
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="role" className="space-y-6">
          <UpdateRoleForm />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Password:</p>
                <p className="text-sm text-muted-foreground">••••••••••</p>
              </div>
              <div>
                <p className="text-sm font-medium">
                  Two-Factor Authentication:
                </p>
                <p className="text-sm text-muted-foreground">Not enabled</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-2">
              <Button variant="outline">Change Password</Button>
              <Button variant="outline" disabled>
                Enable Two-Factor Authentication
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
