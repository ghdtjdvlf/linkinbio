import { NextRequest, NextResponse } from "next/server";
import { readSiteData, writeSiteData } from "@/lib/siteData";

export async function GET() {
  const data = readSiteData();
  return NextResponse.json({ backgroundVideo: data.backgroundVideo });
}

export async function PATCH(req: NextRequest) {
  const { backgroundVideo } = await req.json();
  const data = readSiteData();
  data.backgroundVideo = backgroundVideo;
  writeSiteData(data);
  return NextResponse.json({ backgroundVideo: data.backgroundVideo });
}
