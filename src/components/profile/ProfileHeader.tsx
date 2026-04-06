import Avatar from "@/components/ui/Avatar";
import { UserProfile } from "@/types";

interface ProfileHeaderProps {
  user: UserProfile;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-3 pb-6 text-center">
      <Avatar src={user.image} name={user.name ?? user.username} size="xl" />
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {user.name ?? user.username}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
      </div>
      {user.bio && (
        <p className="max-w-xs text-sm text-gray-600 dark:text-gray-300">{user.bio}</p>
      )}
    </div>
  );
}
