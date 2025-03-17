"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Copy,
  Edit,
  MoreHorizontal,
  Plus,
  Shield,
  Trash2,
  Users,
} from "lucide-react";

const roles = {
  admin: [
    {
      id: 1,
      name: "Super Admin",
      description: "Full access to all system features",
      users: 2,
      permissions: ["Full Access"],
      updatedAt: "2023-06-22",
    },
    {
      id: 2,
      name: "Property Admin",
      description: "Manage all property listings and approvals",
      users: 3,
      permissions: [
        "Create Properties",
        "Edit Properties",
        "Delete Properties",
        "Approve Properties",
      ],
      updatedAt: "2023-05-18",
    },
    {
      id: 3,
      name: "User Admin",
      description: "Manage users and permissions only",
      users: 1,
      permissions: [
        "View Users",
        "Create Users",
        "Edit Users",
        "Delete Users",
        "Assign Roles",
      ],
      updatedAt: "2023-04-12",
    },
  ],
  agent: [
    {
      id: 4,
      name: "Senior Agent",
      description: "Can create and approve listings",
      users: 8,
      permissions: [
        "Create Properties",
        "Edit Properties",
        "Delete Properties",
        "Approve Properties",
      ],
      updatedAt: "2023-06-15",
    },
    {
      id: 5,
      name: "Agent",
      description: "Can create listings pending approval",
      users: 15,
      permissions: ["Create Properties", "Edit Properties"],
      updatedAt: "2023-05-10",
    },
    {
      id: 6,
      name: "Junior Agent",
      description: "Limited listing creation abilities",
      users: 5,
      permissions: ["Create Properties"],
      updatedAt: "2023-04-18",
    },
    {
      id: 7,
      name: "Trainee",
      description: "View-only access to listings",
      users: 2,
      permissions: ["View Properties"],
      updatedAt: "2023-05-22",
    },
  ],
  custom: [
    {
      id: 8,
      name: "Analytics",
      description: "Access to analytics and reports only",
      users: 3,
      permissions: ["View Analytics", "Export Reports"],
      updatedAt: "2023-05-30",
    },
    {
      id: 9,
      name: "Support",
      description: "Customer support capabilities",
      users: 4,
      permissions: ["View Properties", "View Users", "Edit User Details"],
      updatedAt: "2023-06-10",
    },
  ],
};

const RoleCard = ({ role, onEdit, onDelete, onDuplicate, onViewUsers }) => {
  const { toast } = useToast();

  const handleAction = (action, actionFn) => {
    try {
      actionFn(role);
      toast({
        title: "Success",
        description: `Role ${action} successfully`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} role`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          {role.name}
          <RoleDropdownMenu
            onEdit={() => handleAction("edited", onEdit)}
            onDelete={() => handleAction("deleted", onDelete)}
            onDuplicate={() => handleAction("duplicated", onDuplicate)}
            onViewUsers={() => handleAction("viewed", onViewUsers)}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{role.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{role.users} users</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Updated: {role.updatedAt}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium mb-1">Permissions:</p>
          <div className="flex flex-wrap gap-1">
            {role.permissions.map((permission) => (
              <Badge key={permission} variant="outline" className="text-xs">
                {permission}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => handleAction("edited", onEdit)}
        >
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => window.location.href = "/admin/permissions"}
        >
          Permissions
        </Button>
      </CardFooter>
    </Card>
  );
};

const RoleDropdownMenu = ({ onEdit, onDelete, onDuplicate, onViewUsers }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 h-8 w-8"
      >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Actions</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem onClick={onEdit}>
        <Edit className="mr-2 h-4 w-4" /> Edit Role
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onDuplicate}>
        <Copy className="mr-2 h-4 w-4" /> Duplicate Role
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onViewUsers}>
        <Users className="mr-2 h-4 w-4" /> View Users
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        className="text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="mr-2 h-4 w-4" /> Delete Role
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const CreateRoleDialog = ({ open, onOpenChange, onSubmit }) => {
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", description: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Add a new role with specific permissions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="col-span-1">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="col-span-1">
                Description
              </Label>
              <Textarea
                id="description"
                className="col-span-3"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Role</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function RolesPage() {
  const { toast } = useToast();
  const [isCreateRoleOpen, setIsCreateRoleOpen] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState("admin");
  const [rolesData, setRolesData] = React.useState(roles);

  const handleEditRole = (role) => {
    const updatedRoles = { ...rolesData };
    const category = Object.keys(updatedRoles).find(key => 
      updatedRoles[key].some(r => r.id === role.id)
    );
    
    if (category) {
      updatedRoles[category] = updatedRoles[category].map(r => 
        r.id === role.id ? { ...r, updatedAt: new Date().toISOString().split('T')[0] } : r
      );
      setRolesData(updatedRoles);
    }
  };

  const handleDeleteRole = (role) => {
    const updatedRoles = { ...rolesData };
    const category = Object.keys(updatedRoles).find(key => 
      updatedRoles[key].some(r => r.id === role.id)
    );
    
    if (category) {
      updatedRoles[category] = updatedRoles[category].filter(r => r.id !== role.id);
      setRolesData(updatedRoles);
    }
  };

  const handleDuplicateRole = (role) => {
    const updatedRoles = { ...rolesData };
    const category = Object.keys(updatedRoles).find(key => 
      updatedRoles[key].some(r => r.id === role.id)
    );
    
    if (category) {
      const newRole = {
        ...role,
        id: Math.max(...Object.values(rolesData).flat().map(r => r.id)) + 1,
        name: `${role.name} (Copy)`,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      updatedRoles[category] = [...updatedRoles[category], newRole];
      setRolesData(updatedRoles);
    }
  };

  const handleCreateRole = (formData) => {
    const newRole = {
      id: Math.max(...Object.values(rolesData).flat().map(r => r.id)) + 1,
      name: formData.name,
      description: formData.description,
      users: 0,
      permissions: ["View Properties"],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setRolesData(prev => ({
      ...prev,
      custom: [...prev.custom, newRole],
    }));

    setIsCreateRoleOpen(false);
    toast({
      title: "Success",
      description: "Role created successfully",
      variant: "success",
    });
  };

  const handleViewUsers = (role) => {
    toast({
      title: "Users",
      description: `${role.name} has ${role.users} users`,
      variant: "info",
    });
    console.log("Viewing users for role:", role);
    // Add your view users logic here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            Manage user roles and their permissions
          </p>
        </div>
        <Button onClick={() => setIsCreateRoleOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New Role
        </Button>
      </div>

      <CreateRoleDialog
        open={isCreateRoleOpen}
        onOpenChange={setIsCreateRoleOpen}
        onSubmit={handleCreateRole}
      />

      <Tabs
        defaultValue="admin"
        className="space-y-4"
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList>
          {Object.entries(rolesData).map(([key, value]) => (
            <TabsTrigger key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)} Roles ({value.length})
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(rolesData).map(([key, value]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {value.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={handleEditRole}
                  onDelete={handleDeleteRole}
                  onDuplicate={handleDuplicateRole}
                  onViewUsers={handleViewUsers}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
