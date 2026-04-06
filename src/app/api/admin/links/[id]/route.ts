import { NextRequest, NextResponse } from "next/server";
import { readSiteData, writeSiteData } from "@/lib/siteData";
import { type Platform } from "@/config/profile";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { platform, label, url } = await req.json();
  const data = readSiteData();
  data.links = data.links.map((l) =>
    l.id === id ? { ...l, platform: (platform ?? l.platform) as Platform, label: label ?? l.label, url: url ?? l.url } : l
  );
  writeSiteData(data);
  return NextResponse.json(data.links.find((l) => l.id === id));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = readSiteData();
  data.links = data.links.filter((l) => l.id !== id);
  writeSiteData(data);
  return new NextResponse(null, { status: 204 });
}
