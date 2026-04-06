import { NextRequest, NextResponse } from "next/server";
import { readSiteData, writeSiteData, type ShowcaseItem } from "@/lib/siteData";

export async function GET() {
  const data = readSiteData();
  return NextResponse.json(data.showcase);
}

export async function POST(req: NextRequest) {
  const { heading, description, media, link } = await req.json();
  const data = readSiteData();
  const item: ShowcaseItem = {
    id: Date.now().toString(),
    heading,
    description,
    media: media ?? "",
    link: link ?? "",
  };
  data.showcase.push(item);
  writeSiteData(data);
  return NextResponse.json(item, { status: 201 });
}
