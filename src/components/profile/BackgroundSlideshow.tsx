'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

interface BackgroundSlideshowProps {
  slides: string[]; // 이미지 또는 비디오 경로 혼합 가능
}

function isVideo(src: string): boolean {
  return /\.(mp4|webm|mov|ogg)$/i.test(src);
}

function VideoSlide({ src, active }: { src: string; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active) {
      el.currentTime = 0;
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [active]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

export default function BackgroundSlideshow({ slides }: BackgroundSlideshowProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-[600px] -z-0 overflow-hidden">
      <Swiper
        spaceBetween={0}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectFade, Autoplay, Pagination]}
        className="w-full h-full"
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {slides.map((src, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            {isVideo(src) ? (
              <VideoSlide src={src} active={activeIndex === index} />
            ) : (
              <Image
                src={src}
                alt={`background ${index}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 z-[10] pointer-events-none bg-gradient-to-b from-transparent via-[#111111]/10 via-30% via-[#111111]/40 via-60% via-[#111111]/80 via-85% to-[#111111]" />

      <style dangerouslySetInnerHTML={{ __html: `
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.4) !important;
          width: 8px;
          height: 8px;
          transition: all 0.3s;
        }
        .swiper-pagination-bullet-active {
          background: #fff !important;
          opacity: 1 !important;
          width: 24px !important;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.6);
        }
        .swiper-pagination {
          bottom: 120px !important;
          z-index: 30 !important;
        }
      `}} />
    </div>
  );
}
