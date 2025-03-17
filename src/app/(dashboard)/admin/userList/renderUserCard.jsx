import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { UserActionsDropdown } from "./UserActionsDropdown";

// renderUserCard ///////////////////////////////////
export const renderUserCard = (user) => {
  // Function to handle opening the modal
  const openEditModal = (user) => {
    setEditingUser({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setIsModalOpen(true);
  };

  return (
    <Card key={user.id}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span>{user.username}</span>
          <UserActionsDropdown user={user} onEdit={() => openEditModal(user)} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-slate-300 dark:bg-slate-700 text-center text-2xl flex justify-center items-center">
            {user.username?.slice(0, 2).toLowerCase()}
          </div>
          <div>
            <p className="font-medium">{user.email}</p>
            <p className="text-sm text-muted-foreground">{user.role}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        {/* <CardActions userId={user.id} /> */}
      </CardFooter>
    </Card>
  );
};
