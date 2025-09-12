import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  return NextResponse.json({ summary: `Mock summary for: ${text?.slice(0, 30) || "(empty)"}` });
}
