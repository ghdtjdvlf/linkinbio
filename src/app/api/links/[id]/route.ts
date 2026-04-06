import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function getOwnedLink(id: string, userId: string) {
  return db.link.findFirst({ where: { id, userId } });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const link = await getOwnedLink(id, session.user.id);
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = await req.json();
  const updated = await db.link.update({
    where: { id },
    data: { title: data.title, url: data.url, icon: data.icon, active: data.active },
    include: { _count: { select: { clicks: true } } },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const link = await getOwnedLink(id, session.user.id);
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.link.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
