import { NextResponse } from "next/server";

const chartData = [
  { name: "Jan", value: 120 },
  { name: "Feb", value: 150 },
  { name: "Mar", value: 90 },
  { name: "Apr", value: 200 },
  { name: "May", value: 170 },
];

export async function GET() {
  return NextResponse.json(chartData);
}
