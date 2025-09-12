import { NextResponse } from "next/server";

const alerts = [
  { id: "1", message: "System running smoothly", severity: "info" },
  { id: "2", message: "API latency high", severity: "warning" },
  { id: "3", message: "Trading halted", severity: "danger" },
];

export async function GET() {
  return NextResponse.json(alerts);
}
