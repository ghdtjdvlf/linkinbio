import { type Platform } from "@/config/profile";
import siteJson from "@/data/site.json";

export interface SiteLink {
  id: string;
  platform: Platform;
  label: string;
  url: string;
  thumbnail?: string;
  showImage?: boolean;
  mix?: boolean;
  span?: number;
  compact?: boolean;
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

export function readSiteData(): SiteData {
  return siteJson as SiteData;
}
