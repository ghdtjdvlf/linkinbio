import { type VideoItem } from "@/config/profile";
import VideoCard from "./VideoCard";

interface VideoRowProps {
  videos: VideoItem[];
}

export default function VideoRow({ videos }: VideoRowProps) {
  if (videos.length === 0) return null;

  return (
    <div className="mb-8 w-full">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {videos.map((video, i) => (
          <div key={i} className="snap-start">
            <VideoCard video={video} />
          </div>
        ))}
      </div>
    </div>
  );
}
