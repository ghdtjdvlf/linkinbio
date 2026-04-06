import fs from "fs";
import path from "path";
import { type Platform } from "@/config/profile";

export interface SiteLink {
  id: string;
  platform: Platform;
  label: string;
  url: string;
  thumbnail?: string;   // 카드 배경 이미지
  showImage?: boolean;  // false면 이미지 영역 숨김 (기본 true)
  mix?: boolean;        // true면 텍스트 겹침, false면 분리
  span?: number;        // 그리드 칸 수 (1~6, 기본 자동)
  compact?: boolean;    // true면 낮은 높이
}

export interface ShowcaseItem {
  id: string;
  heading: string;
  description: string;
  media: string;
  link?: string;
}

export interface SiteData {
  backgroundVideo: string;
  links: SiteLink[];
  showcase: ShowcaseItem[];
}

const filePath = path.join(process.cwd(), "src/data/site.json");

export function readSiteData(): SiteData {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as SiteData;
}

export function writeSiteData(data: SiteData) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
