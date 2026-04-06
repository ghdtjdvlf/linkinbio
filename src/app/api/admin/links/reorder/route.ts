import { NextRequest, NextResponse } from "next/server";
import { readSiteData, writeSiteData } from "@/lib/siteData";

export async function PATCH(req: NextRequest) {
  const { ids } = await req.json() as { ids: string[] };
  const data = readSiteData();
  data.links = ids
    .map((id) => data.links.find((l) => l.id === id))
    .filter(Boolean) as typeof data.links;
  writeSiteData(data);
  return new NextResponse(null, { status: 204 });
}
