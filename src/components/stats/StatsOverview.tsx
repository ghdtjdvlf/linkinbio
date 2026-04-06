import { Card } from "@/components/ui/Card";
import { formatNumber } from "@/lib/utils";
import { BarChart2, MousePointerClick, Link2, TrendingUp } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface StatsOverviewProps {
  totalClicks: number;
  totalLinks: number;
  clicksToday: number;
  topLinkTitle?: string;
}

export default function StatsOverview({
  totalClicks,
  totalLinks,
  clicksToday,
  topLinkTitle,
}: StatsOverviewProps) {
  const stats: StatItem[] = [
    {
      label: "Total Clicks",
      value: totalClicks,
      icon: <MousePointerClick className="h-5 w-5" />,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30",
    },
    {
      label: "Active Links",
      value: totalLinks,
      icon: <Link2 className="h-5 w-5" />,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Clicks Today",
      value: clicksToday,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "Top Link",
      value: 0,
      icon: <BarChart2 className="h-5 w-5" />,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={stat.label} padding="sm">
          <div className={`mb-3 inline-flex rounded-lg p-2 ${stat.color}`}>
            {stat.icon}
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {i === 3 ? (topLinkTitle ? "—" : "—") : formatNumber(stat.value)}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {i === 3 ? (topLinkTitle ?? "No links") : stat.label}
          </p>
        </Card>
      ))}
    </div>
  );
}
