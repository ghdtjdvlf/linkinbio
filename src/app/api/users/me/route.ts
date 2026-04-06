import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, username: true, name: true, bio: true, image: true, theme: true },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, bio, theme } = await req.json();

  const updated = await db.user.update({
    where: { id: session.user.id },
    data: { name, bio, theme },
    select: { id: true, username: true, name: true, bio: true, image: true, theme: true },
  });

  return NextResponse.json(updated);
}
