import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ids } = await req.json() as { ids: string[] };
  const userId = session.user!.id;

  await db.$transaction(
    ids.map((id, index) =>
      db.link.updateMany({
        where: { id, userId },
        data: { order: index },
      })
    )
  );

  return new NextResponse(null, { status: 204 });
}
