import { profile } from "@/config/profile";
import { readSiteData } from "@/lib/siteData";
import BentoLinks from "@/components/profile/BentoLinks";
import { Showcase } from "@/components/ui/showcase";
import BackgroundSlideshow from "@/components/profile/BackgroundSlideshow";
import LustreText from "@/components/ui/lustretext";

// 배경 슬라이드 배열 — 이미지(.png/.jpg)와 비디오(.mp4/.webm) 혼합 가능
const BACKGROUND_SLIDES = [
  "/uploads/video/0407.mp4",
  "/uploads/video/video (2).mp4",
  "/uploads/video/video (1).mp4", 
  // "/uploads/bg_video.mp4",  ← 비디오 추가 예시
];

export default function HomePage() {
  const data = readSiteData();

  return (
    <main className="relative min-h-screen bg-[#111111] text-white overflow-x-hidden">
      {/* 배경 슬라이더 (Swiper - EffectFade) */}
      {profile.showImage && (
        <BackgroundSlideshow slides={BACKGROUND_SLIDES} />
      )}

      {/* 컨텐츠 영역: 상단 pt-[500px]에서 배경을 터치할 수 있게 pointer-events 처리 */}
      <div className="relative z-10 mx-auto w-full max-w-lg px-4 pt-[500px] pb-16 space-y-10 pointer-events-none">
        <div className="flex flex-col items-center gap-4 text-center pointer-events-auto">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white drop-shadow-lg">
              <LustreText text={profile.name} className="text-4xl" />
            </h1>
            <p className="text-sm font-bold text-gray-400 bg-black/40 backdrop-blur-md inline-block px-3 py-1 rounded-full border border-white/10">
              {profile.username}
            </p>
          </div>
          
          <LustreText 
            words={["Next.js 개발자", "콘텐츠 크리에이터", "프리랜서 디자이너"]} 
            className="text-xl font-bold"
            duration={3}
            pauseDuration={2500}
          />

          {profile.bio && (
            <p className="text-sm leading-relaxed text-gray-300 max-w-xs font-medium bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-white/5">
              {profile.bio}
            </p>
          )}
        </div>

        <div className="pointer-events-auto">
          <BentoLinks links={data.links} />
        </div>

        {data.showcase.length > 0 && (
          <div className="pt-4 pointer-events-auto">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Featured
            </p>
            <Showcase items={data.showcase} mediaClass="h-64 md:h-auto" />
          </div>
        )}
      </div>
    </main>
  );
}