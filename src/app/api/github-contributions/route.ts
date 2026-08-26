import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.github.com/users/muhammedfahim438-ctrl/events?per_page=100",
      { headers: { Accept: "application/vnd.github.v3+json" } }
    );

    if (!res.ok) {
      return NextResponse.json({ contributions: [] }, { status: 200 });
    }

    const events = await res.json();
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const contributions: Record<string, number> = {};

    for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split("T")[0];
      contributions[key] = 0;
    }

    events
      .filter((e: { type: string }) => e.type === "PushEvent")
      .forEach((event: { created_at: string }) => {
        const date = event.created_at.split("T")[0];
        if (contributions[date] !== undefined) {
          contributions[date]++;
        }
      });

    const result = Object.entries(contributions).map(([date, count]) => ({
      date,
      count,
    }));

    return NextResponse.json({ contributions: result });
  } catch {
    return NextResponse.json({ contributions: [] }, { status: 200 });
  }
}
