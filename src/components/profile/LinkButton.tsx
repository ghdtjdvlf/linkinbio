"use client";

import { ExternalLink } from "lucide-react";
import { LinkItem } from "@/types";

interface LinkButtonProps {
  link: LinkItem;
}

export default function LinkButton({ link }: LinkButtonProps) {
  const handleClick = async () => {
    await fetch(`/api/clicks/${link.id}`, { method: "POST" });
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className="group flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 text-left font-medium text-gray-900 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md active:scale-[0.98] dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-indigo-500"
    >
      <span className="flex items-center gap-3">
        {link.icon && <span className="text-xl">{link.icon}</span>}
        {link.title}
      </span>
      <ExternalLink className="h-4 w-4 text-gray-400 transition-colors group-hover:text-indigo-500" />
    </button>
  );
}
