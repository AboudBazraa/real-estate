// import { useAuth } from "@/app/auth/hooks/useAuth";
// import { Avatar } from "./ui/avatar"; // Assuming you're using shadcn/ui

// export function NavUser() {
//   const { user } = useAuth();

//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="flex items-center gap-2">
//       <Avatar>
//         <img
//           src={user.avatar || '/default-avatar.png'}
//           alt={user.username}
//           className="h-8 w-8 rounded-full"
//           onError={(e) => {
//             // Fallback to default avatar if image fails to load
//             e.currentTarget.src = '/default-avatar.png';
//           }}
//         />
//       </Avatar>
//       <div className="flex flex-col">
//         <span className="text-sm font-medium">{user.username}</span>
//         <span className="text-xs text-gray-500">{user.role}</span>
//       </div>
//     </div>
//   );
// } 