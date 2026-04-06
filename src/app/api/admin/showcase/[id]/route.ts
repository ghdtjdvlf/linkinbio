import { NextRequest, NextResponse } from "next/server";
import { readSiteData, writeSiteData } from "@/lib/siteData";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const data = readSiteData();
  data.showcase = data.showcase.map((s) =>
    s.id === id ? { ...s, ...body } : s
  );
  writeSiteData(data);
  return NextResponse.json(data.showcase.find((s) => s.id === id));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = readSiteData();
  data.showcase = data.showcase.filter((s) => s.id !== id);
  writeSiteData(data);
  return new NextResponse(null, { status: 204 });
}
