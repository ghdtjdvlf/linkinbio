import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import LinkList from "@/components/dashboard/LinkList";
import ProfileForm from "@/components/dashboard/ProfileForm";
import StatsOverview from "@/components/stats/StatsOverview";
import { LinkItem } from "@/types";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      links: {
        orderBy: { order: "asc" },
        include: { _count: { select: { clicks: true } } },
      },
    },
  });

  if (!user) redirect("/login");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalClicks, clicksToday] = await Promise.all([
    db.click.count({ where: { link: { userId: user.id } } }),
    db.click.count({ where: { link: { userId: user.id }, clickedAt: { gte: today } } }),
  ]);

  const topLink = user.links.sort((a, b) => (b._count?.clicks ?? 0) - (a._count?.clicks ?? 0))[0];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your links at{" "}
            <a
              href={`/${user.username}`}
              className="text-indigo-600 hover:underline"
              target="_blank"
            >
              /{user.username}
            </a>
          </p>
        </div>

        <StatsOverview
          totalClicks={totalClicks}
          totalLinks={user.links.filter((l) => l.active).length}
          clicksToday={clicksToday}
          topLinkTitle={topLink?.title}
        />

        <ProfileForm
          initial={{ name: user.name, bio: user.bio, username: user.username }}
        />

        <LinkList initialLinks={user.links as LinkItem[]} />
      </div>
    </main>
  );
}
