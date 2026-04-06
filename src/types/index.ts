export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string | null;
  order: number;
  active: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: { clicks: number };
}

export interface UserProfile {
  id: string;
  username: string;
  name?: string | null;
  image?: string | null;
  bio?: string | null;
  theme: string;
  links: LinkItem[];
}

export interface ClickStats {
  linkId: string;
  title: string;
  total: number;
  byDay: { date: string; count: number }[];
}
