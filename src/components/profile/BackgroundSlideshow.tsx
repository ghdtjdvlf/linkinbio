'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

interface BackgroundSlideshowProps {
  slides: string[];
}

function isVideo(src: string): boolean {
  return /\.(mp4|webm|mov|ogg)$/i.test(src);
}

function VideoSlide({ src, active, onEnded }: { src: string; active: boolean; onEnded: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onEndedRef = useRef(onEnded);
  useEffect(() => { onEndedRef.current = onEnded; }, [onEnded]);

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

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const handleEnded = () => onEndedRef.current();
    el.addEventListener('ended', handleEnded);
    return () => el.removeEventListener('ended', handleEnded);
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

export default function BackgroundSlideshow({ slides }: BackgroundSlideshowProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleVideoEnded = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-[600px] -z-0 overflow-hidden">
      <Swiper
        spaceBetween={0}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        pagination={{ clickable: true }}
        modules={[EffectFade, Pagination]}
        className="w-full h-full"
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {slides.map((src, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            {isVideo(src) ? (
              <VideoSlide src={src} active={activeIndex === index} onEnded={handleVideoEnded} />
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
