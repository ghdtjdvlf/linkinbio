import { NextRequest, NextResponse } from "next/server";
import { readSiteData, writeSiteData } from "@/lib/siteData";
import { type Platform } from "@/config/profile";

export async function GET() {
  const data = readSiteData();
  return NextResponse.json(data.links);
}

export async function POST(req: NextRequest) {
  const { platform, label, url } = await req.json();
  const data = readSiteData();
  const newLink = {
    id: Date.now().toString(),
    platform: platform as Platform,
    label,
    url,
  };
  data.links.push(newLink);
  writeSiteData(data);
  return NextResponse.json(newLink, { status: 201 });
}
