import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-token");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { revalidated: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  revalidateTag("portfolio", "default");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
