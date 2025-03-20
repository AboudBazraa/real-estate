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

// UserActionsDropdown ///////////////////////////////////
export function UserActionsDropdown({ user, onRefresh }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState(
    user.user_metadata?.role || Roles.USER
  );

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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <Shield className="mr-2 h-4 w-4" />
            Update User Role
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2">User: {user.email}</p>
            <p className="mb-4 text-sm text-muted-foreground">
              Current role:{" "}
              <span className="capitalize">
                {user.user_metadata?.role || "Not set"}
              </span>
            </p>
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Roles.USER}>User</SelectItem>
                <SelectItem value={Roles.AGENT}>Agent</SelectItem>
                <SelectItem value={Roles.ADMIN}>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpdateUserRole}
              disabled={isUpdating || selectedRole === user.user_metadata?.role}
            >
              {isUpdating ? "Updating..." : "Update Role"}
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete the user{" "}
            <strong>{user.email}</strong>?
            <br />
            <span className="text-sm text-muted-foreground">
              This action cannot be undone.
            </span>
          </p>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
