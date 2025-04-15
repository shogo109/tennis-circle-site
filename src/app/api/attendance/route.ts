import { NextResponse } from "next/server";
import { createOrUpdateAttendance } from "@/lib/notion/attendance";
import type { AttendanceStatus } from "@/lib/notion/attendance";

export async function POST(request: Request) {
  try {
    const { eventId, userId, status } = await request.json();

    // バリデーション
    if (!eventId || !userId || !status) {
      console.error("Missing required fields:", { eventId, userId, status });
      return NextResponse.json(
        { error: "Missing required fields: eventId, userId, or status" },
        { status: 400 }
      );
    }

    const result = await createOrUpdateAttendance(eventId, userId, status as AttendanceStatus);

    if (!result) {
      return NextResponse.json({ error: "Failed to update attendance" }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating attendance:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to update attendance", details: errorMessage },
      { status: 500 }
    );
  }
}
