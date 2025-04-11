"use client";

import { useAuth } from "@/app/auth/hooks/useAuth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  LoaderCircle,
  SunMoon,
  User,
  Mail,
  Key,
  Calendar,
  Shield,
  BellRing,
  LogOut,
  Lock,
  Upload,
  ArrowRightLeft,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Switch } from "@/shared/components/ui/switch";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export default function ProfilePage() {
  const { user, loading, logout, updatePassword } = useAuth();
  const currentRole = useRole();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
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

  const [notifications, setNotifications] = useState({
    email: true,
    app: true,
    marketing: false,
    updates: true,
  });

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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

  if (loading || isInitialLoad) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex min-h-screen items-center justify-center"
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <LoaderCircle className="h-10 w-10 text-primary" />
          </motion.div>
          <motion.p
            className="text-muted-foreground font-medium"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading your profile...
          </motion.p>
        </div>
      </motion.div>
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

  // Simulate user stats
  const userStats = {
    propertiesListed: 12,
    propertiesSold: 8,
    totalRating: 4.8,
    profileCompletion: 85,
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4 }}
      variants={fadeIn}
      className="container mx-auto p-2 "
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-8 rounded-xl border bg-card p-6 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={user.user_metadata?.avatar} alt={username} />
              <AvatarFallback className="text-3xl">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <Dialog
              open={isUploadModalOpen}
              onOpenChange={setIsUploadModalOpen}
            >
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md"
                  variant="secondary"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Profile Picture</DialogTitle>
                  <DialogDescription>
                    Choose an image to use as your profile picture
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex justify-center">
                    <Avatar className="h-36 w-36 border-4 border-background">
                      <AvatarImage
                        src={user.user_metadata?.avatar}
                        alt={username}
                      />
                      <AvatarFallback className="text-5xl">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="picture">Profile Picture</Label>
                    <Input id="picture" type="file" accept="image/*" />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsUploadModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="button">Upload</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{username}</h1>
              <Badge variant="outline" className="ml-2 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-4 w-4" /> {user.email}
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold">
                  {userStats.propertiesListed}
                </span>
                <span className="text-xs text-muted-foreground">
                  Properties Listed
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold">
                  {userStats.propertiesSold}
                </span>
                <span className="text-xs text-muted-foreground">
                  Properties Sold
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold">
                  {userStats.totalRating}
                </span>
                <span className="text-xs text-muted-foreground">Rating</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold">
                  {userStats.profileCompletion}%
                </span>
                <span className="text-xs text-muted-foreground">
                  Profile Completion
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <BellRing className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="account-tab"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInUp}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    View and manage your personal account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">
                        User ID
                      </Label>
                      <div className="p-2 rounded-md bg-muted font-mono text-xs break-all">
                        {user.id}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">
                        Email Address
                      </Label>
                      <div className="flex justify-between items-center">
                        <div className="p-2 rounded-md bg-muted text-sm w-full overflow-hidden">
                          {user.email}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2"
                          disabled
                        >
                          <ArrowRightLeft className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">
                        Username
                      </Label>
                      <div className="flex justify-between items-center">
                        <Input value={username} className="h-9" readOnly />
                        <Button variant="ghost" size="icon" className="ml-2">
                          <ArrowRightLeft className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">
                        Last Sign In
                      </Label>
                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {user.last_sign_in_at
                          ? new Date(user.last_sign_in_at).toLocaleString()
                          : "Never"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-xs">
                      Profile Completion
                    </Label>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${userStats.profileCompletion}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your profile is {userStats.profileCompletion}% complete.
                      Add more details to improve your visibility.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-6">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="security-tab"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInUp}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="font-medium">Password</div>
                        <div className="text-sm text-muted-foreground">
                          Change your password for improved security
                        </div>
                      </div>
                      <Button
                        onClick={() => setIsPasswordModalOpen(true)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Key className="h-4 w-4" />
                        Change Password
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="font-medium">
                          Two-Factor Authentication
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </div>
                      </div>
                      <Button variant="outline">Set Up</Button>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="font-medium">Active Sessions</div>
                        <div className="text-sm text-muted-foreground">
                          Manage devices where you're currently logged in
                        </div>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="font-medium">Account Activity Logs</div>
                        <div className="text-sm text-muted-foreground">
                          View a log of activities and events on your account
                        </div>
                      </div>
                      <Button variant="outline">View Logs</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="notifications-tab"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInUp}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </div>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            email: checked,
                          }))
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="font-medium">In-App Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications within the application
                        </div>
                      </div>
                      <Switch
                        checked={notifications.app}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            app: checked,
                          }))
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="font-medium">Marketing Emails</div>
                        <div className="text-sm text-muted-foreground">
                          Receive emails about new features and promotions
                        </div>
                      </div>
                      <Switch
                        checked={notifications.marketing}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            marketing: checked,
                          }))
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="font-medium">System Updates</div>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications about system changes and updates
                        </div>
                      </div>
                      <Switch
                        checked={notifications.updates}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            updates: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      <Dialog
        open={isPasswordModalOpen}
        onOpenChange={(open) => {
          setIsPasswordModalOpen(open);
          if (!open) handleModalClose();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your password to maintain account security
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <AnimatePresence>
              {passwordChangeStatus.error && (
                <motion.div
                  key="error"
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
                  key="success"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      Your password has been successfully updated.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handleInputChange}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handleInputChange}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handleInputChange}
                required
                autoComplete="new-password"
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  passwordChangeStatus.loading || passwordChangeStatus.success
                }
                className="w-full"
              >
                {passwordChangeStatus.loading ? (
                  <span className="flex items-center">
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Changing...
                  </span>
                ) : (
                  "Update Password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
