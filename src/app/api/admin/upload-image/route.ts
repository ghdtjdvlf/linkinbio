import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase();
  const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
  if (!ext || !allowed.includes(ext)) {
    return NextResponse.json({ error: "jpg, png, webp만 가능합니다" }, { status: 400 });
  }

  const filename = `img-${Date.now()}.${ext}`;
  const dest = path.join(process.cwd(), "public/uploads", filename);
  const bytes = await file.arrayBuffer();
  await writeFile(dest, Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/${filename}` });
}
