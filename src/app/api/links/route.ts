import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const links = await db.link.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
    include: { _count: { select: { clicks: true } } },
  });

  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, url, icon } = await req.json();
  if (!title || !url) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const count = await db.link.count({ where: { userId: session.user.id } });

  const link = await db.link.create({
    data: { title, url, icon, order: count, userId: session.user.id },
    include: { _count: { select: { clicks: true } } },
  });

  return NextResponse.json(link, { status: 201 });
}
