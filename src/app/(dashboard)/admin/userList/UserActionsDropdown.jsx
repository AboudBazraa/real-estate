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
  DialogOverlay,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

import { useApiMutation } from "@/shared/hooks/useApi";

// UserActionsDropdown ///////////////////////////////////
export function UserActionsDropdown({ user, onEdit }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    role: user.role,
    username: user.username,
    email: user.email,
  });

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Adjust this line based on how you store the token
    },
  };

  const updateUserRoleMutation = useApiMutation(
    ["updateUserRole"],
    { url: `/User/Update/${user.id}`, ...authHeaders },
    "PUT"
  );

  const deleteUserMutation = useApiMutation(
    ["deleteUser"],
    { url: `/User/Delete/${user.id}`, ...authHeaders },
    "DELETE"
  );

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    await updateUserRoleMutation.mutateAsync(formData);
    setIsDialogOpen(false);
  };

  const handleDeleteUser = async () => {
    await deleteUserMutation.mutateAsync();
    setIsDeleteDialogOpen(false);
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
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit User
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <Shield className="mr-2 h-4 w-4" />
            Update User Role
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Update User Role</DialogTitle>
          <form onSubmit={handleUpdateUser}>
            <div>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                className="text-gray-500"
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={0}>Admin</SelectItem>
                  <SelectItem value={1}>Agent</SelectItem>
                  <SelectItem value={2}>User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit">Update</Button>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Confirm Delete</DialogTitle>
          <p>Are you sure you want to delete this user?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
