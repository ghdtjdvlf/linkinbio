export const profile = {
  name: "Lia Kim",
  username: "@myhandle",
  bio: "한 줄 소개를 여기에 적어주세요 ✨",
  image: "/uploads/main.png",  // public/profile.jpg
  showImage: true,        // false로 바꾸면 프로필 사진 숨김
};

export type Platform =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "twitter"
  | "facebook"
  | "linkedin"
  | "github"
  | "custom";

export interface SnsLink {
  platform: Platform;
  label: string;
  url: string;
}

export interface VideoItem {
  title: string;
  src: string;       // /videos/clip1.mp4 또는 외부 URL
  thumbnail?: string; // 썸네일 이미지 (없으면 video 첫 프레임)
  link?: string;     // 클릭 시 이동할 URL (선택)
}

export const videos: VideoItem[] = [
  {
    title: "영상 제목 1",
    src: "/videos/clip1.mp4",
    link: "https://youtube.com/@yourchannel",
  },
  {
    title: "영상 제목 2",
    src: "/videos/clip2.mp4",
    link: "https://youtube.com/@yourchannel",
  },
  {
    title: "영상 제목 3",
    src: "/videos/clip3.mp4",
    link: "https://youtube.com/@yourchannel",
  },
];

export const links: SnsLink[] = [
  {
    platform: "instagram",
    label: "Instagram",
    url: "https://instagram.com/yourhandle",
  },
  {
    platform: "youtube",
    label: "YouTube",
    url: "https://youtube.com/@yourchannel",
  },
  {
    platform: "tiktok",
    label: "TikTok",
    url: "https://tiktok.com/@yourhandle",
  },
  {
    platform: "twitter",
    label: "Twitter / X",
    url: "https://twitter.com/yourhandle",
  },
];
