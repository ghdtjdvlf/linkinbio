"use client";

import { type Platform } from "@/config/profile";
import { ExternalLink } from "lucide-react";

interface SnsLink {
  platform: Platform;
  label: string;
  url: string;
  thumbnail?: string;
}

const platformConfig: Record<Platform, { bg: string; icon: string }> = {
  instagram: { bg: "from-purple-500 via-pink-500 to-orange-400", icon: "📸" },
  youtube:   { bg: "from-red-600 to-red-500",                    icon: "▶️" },
  tiktok:    { bg: "from-zinc-900 to-zinc-700",                  icon: "🎵" },
  twitter:   { bg: "from-zinc-900 to-zinc-700",                  icon: "𝕏"  },
  facebook:  { bg: "from-blue-600 to-blue-500",                  icon: "f"  },
  linkedin:  { bg: "from-sky-700 to-sky-600",                    icon: "in" },
  github:    { bg: "from-zinc-800 to-zinc-700",                  icon: "⌥" },
  custom:    { bg: "from-indigo-600 to-indigo-500",              icon: "🔗" },
};

interface SnsCardProps {
  link: SnsLink;
}

export default function SnsCard({ link }: SnsCardProps) {
  const cfg = platformConfig[link.platform];

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl px-5 py-4 font-semibold text-white shadow-md transition-all active:scale-[0.97] hover:opacity-90"
    >
      {/* 배경: 이미지 있으면 이미지, 없으면 그라디언트 */}
      {link.thumbnail ? (
        <>
          <img
            src={link.thumbnail}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* 이미지 위 다크 오버레이 */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        </>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-r ${cfg.bg}`} />
      )}

      {/* 콘텐츠 */}
      <div className="relative flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-lg font-bold">
          {cfg.icon}
        </span>
        <span className="text-base drop-shadow">{link.label}</span>
      </div>
      <ExternalLink className="relative h-4 w-4 opacity-60 transition-opacity group-hover:opacity-100" />
    </a>
  );
}
