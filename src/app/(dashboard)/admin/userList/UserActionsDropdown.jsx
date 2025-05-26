import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
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
  Edit,
  EyeOff,
  CheckCircle,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useUpdateUserRole } from "@/app/auth/hooks/useUpdateUserRole";
import Roles from "@/app/auth/types/roles";
import { useToast } from "@/shared/hooks/use-toast";
import { updateUserRole, deleteUser } from "./utils/supabaseAdmin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { useTranslation } from "@/shared/hooks/useTranslation";
import userListTranslations from "./translations";

// UserActionsDropdown ///////////////////////////////////
export function UserActionsDropdown({
  user,
  onEdit,
  onDelete,
  onStatusChange,
  onView,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState(
    user.user_metadata?.role || Roles.USER
  );
  const { currentLanguage, isRTL } = useTranslation();

  // Get translations based on current language
  const t = userListTranslations[currentLanguage] || userListTranslations.en;

  const isBlocked = user?.status === "blocked";

  const handleRoleChange = (value) => {
    setSelectedRole(value);
  };

  const handleUpdateUserRole = async () => {
    if (selectedRole === user.user_metadata?.role) {
      setIsDialogOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      const { data, error } = await updateUserRole(user.id, selectedRole);

      if (error) {
        throw error;
      }

      toast({
        title: "Role updated",
        description: `User role has been updated to ${selectedRole}`,
      });

      if (onRefresh) {
        onRefresh(); // Refresh the user list after successful update
      }
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    try {
      const { data, error } = await deleteUser(user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "User deleted",
        description: "The user has been deleted",
      });

      if (onRefresh) {
        onRefresh(); // Refresh the user list after successful deletion
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = () => {
    setIsDeleteDialogOpen(false);
    onStatusChange(user.id, isBlocked ? "active" : "blocked");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={isRTL ? "start" : "end"}
          className={isRTL ? "rtl text-right" : ""}
        >
          <DropdownMenuLabel>{t.actions}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onView}
            className={isRTL ? "flex-row-reverse" : ""}
          >
            <User className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
            {t.viewDetails}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onEdit}
            className={isRTL ? "flex-row-reverse" : ""}
          >
            <Edit className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
            {t.editUser}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className={`text-red-600 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Trash2 className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
            {t.deleteUser}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className={isRTL ? "rtl text-right" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteUser}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.confirmDeleteUser}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block/unblock confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className={isRTL ? "rtl text-right" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isBlocked ? t.unblockUser : t.blockUser}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isBlocked ? t.confirmUnblockUser : t.confirmBlockUser}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusChange}
              className={
                isBlocked
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-amber-600 hover:bg-amber-700"
              }
            >
              {isBlocked ? t.unblockUser : t.blockUser}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
