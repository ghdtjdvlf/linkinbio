'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

interface BackgroundSlideshowProps {
  images: string[];
}

export default function BackgroundSlideshow({ images }: BackgroundSlideshowProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-[600px] -z-0 overflow-hidden">
      <Swiper
        spaceBetween={0}
        effect={'fade'}
        fadeEffect={{
          crossFade: true
        }}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[EffectFade, Autoplay, Pagination]}
        className="w-full h-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            <Image
              src={src}
              alt={`background ${index}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 
        부드러운 그라데이션 오버레이:
        층이 생기지 않도록 여러 단계(multiple steps)의 투명도를 적용하여
        배경색인 #111111과 더 자연스럽게 섞이도록 수정했습니다.
      */}
      <div className="absolute inset-0 z-[10] pointer-events-none bg-gradient-to-b from-transparent via-[#111111]/10 via-30% via-[#111111]/40 via-60% via-[#111111]/80 via-85% to-[#111111]" />

      {/* Swiper 스타일 커스터마이징 */}
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