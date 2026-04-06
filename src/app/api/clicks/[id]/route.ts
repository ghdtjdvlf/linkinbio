import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const link = await db.link.findUnique({ where: { id, active: true } });
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.click.create({
    data: {
      linkId: id,
      userAgent: req.headers.get("user-agent") ?? undefined,
    },
  });

  return new NextResponse(null, { status: 201 });
}
