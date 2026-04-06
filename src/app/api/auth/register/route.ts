import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { name, username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const exists = await db.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (exists) {
    return NextResponse.json({ error: "Email or username already taken" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: { name, username, email, password: hashed },
  });

  return NextResponse.json({ id: user.id, username: user.username }, { status: 201 });
}
