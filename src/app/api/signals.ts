import { NextResponse } from "next/server";

const tradingSignals = [
  { id: "1", signal: "Buy" },
  { id: "2", signal: "Sell" },
  { id: "3", signal: "Hold" },
];

export async function GET() {
  return NextResponse.json(tradingSignals);
}
