import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProfileHeader from "@/components/profile/ProfileHeader";
import LinkButton from "@/components/profile/LinkButton";
import { LinkItem, UserProfile } from "@/types";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const user = await db.user.findUnique({ where: { username } });
  if (!user) return {};
  return {
    title: `${user.name ?? user.username} | Link in Bio`,
    description: user.bio ?? `Check out ${user.username}'s links`,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;

  const user = await db.user.findUnique({
    where: { username },
    include: {
      links: {
        where: { active: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!user) notFound();

  // Explicitly cast user to UserProfile if needed, but Prisma type should be compatible
  const userProfile = user as unknown as UserProfile;

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-md px-4 py-16">
        <ProfileHeader user={userProfile} />
        <div className="space-y-3">
          {userProfile.links.map((link: LinkItem) => (
            <LinkButton key={link.id} link={link} />
          ))}
        </div>
        {userProfile.links.length === 0 && (
          <p className="mt-8 text-center text-sm text-gray-400">No links yet.</p>
        )}
      </div>
    </main>
  );
}