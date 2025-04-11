"use client";

import { useAuth } from "@/app/auth/hooks/useAuth";
import { useState } from "react";
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
import { useRole } from "@/app/auth/hooks/useRole";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
import { LoaderCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";

export default function ProfilePage() {
  const { user, loading, logout, updatePassword } = useAuth();
  const currentRole = useRole();
  const router = useRouter();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordChangeStatus, setPasswordChangeStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Reset status
    setPasswordChangeStatus({ loading: true, success: false, error: null });

    // Basic validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordChangeStatus({
        loading: false,
        success: false,
        error: "New passwords don't match",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordChangeStatus({
        loading: false,
        success: false,
        error: "Password must be at least 8 characters",
      });
      return;
    }

    try {
      // Call your auth service's password update function
      await updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      setPasswordChangeStatus({
        loading: false,
        success: true,
        error: null,
      });

      // Clear form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Close modal after showing success for a moment
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordChangeStatus({
          loading: false,
          success: false,
          error: null,
        });
      }, 2000);
    } catch (error) {
      setPasswordChangeStatus({
        loading: false,
        success: false,
        error: error.message || "Failed to change password",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  // When modal closes, reset the form and status
  const handleModalClose = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordChangeStatus({ loading: false, success: false, error: null });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
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
      className="container mx-auto"
    >
      <div className="mb-5 flex flex-col md:flex-row md:items-center gap-6">
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

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
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
              <Dialog
                open={isPasswordModalOpen}
                onOpenChange={(open) => {
                  setIsPasswordModalOpen(open);
                  if (!open) handleModalClose();
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">Change Password</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Update your password to maintain account security
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    onSubmit={handlePasswordChange}
                    className="space-y-4 py-4"
                  >
                    <AnimatePresence>
                      {passwordChangeStatus.error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                              {passwordChangeStatus.error}
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}

                      {passwordChangeStatus.success && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Alert className="bg-green-50 text-green-800 border-green-200">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>
                              Your password has been updated successfully!
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <DialogFooter className="pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsPasswordModalOpen(false)}
                        disabled={passwordChangeStatus.loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          passwordChangeStatus.loading ||
                          passwordChangeStatus.success
                        }
                        className="relative"
                      >
                        {passwordChangeStatus.loading ? (
                          <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : passwordChangeStatus.success ? (
                          "Updated!"
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

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
