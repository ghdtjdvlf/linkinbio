"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { type VideoItem } from "@/config/profile";

interface VideoCardProps {
  video: VideoItem;
}

export default function VideoCard({ video }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handleMouseEnter = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setPlaying(false);
  };

  const content = (
    <div
      className="relative h-52 w-36 shrink-0 overflow-hidden rounded-2xl cursor-pointer shadow-lg shadow-black/40"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 비디오 */}
      <video
        ref={videoRef}
        src={video.src}
        poster={video.thumbnail}
        muted
        loop
        playsInline
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* 플레이 아이콘 — 재생 전 */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Play className="h-5 w-5 fill-white text-white" />
          </div>
        </div>
      )}

      {/* 하단 블러 오버레이 */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-3"
           style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }}>
        <div className="rounded-lg backdrop-blur-md bg-white/10 px-2 py-1.5 border border-white/10">
          <p className="text-xs font-medium text-white line-clamp-2 leading-tight">
            {video.title}
          </p>
        </div>
      </div>
    </div>
  );

  if (video.link) {
    return (
      <a href={video.link} target="_blank" rel="noopener noreferrer" className="group">
        {content}
      </a>
    );
  }

  return <div className="group">{content}</div>;
}
