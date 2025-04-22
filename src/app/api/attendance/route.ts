import { NextResponse } from "next/server";
import { createOrUpdateAttendance } from "@/lib/notion/attendance";
import { AttendanceStatus } from "@/lib/notion/attendance";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, userId, status, memo } = body;

    if (!eventId || !userId || !status) {
      return NextResponse.json({ error: "必須パラメータが不足しています" }, { status: 400 });
    }

    // 出欠ステータスのバリデーション
    const validStatuses: AttendanceStatus[] = ["going", "not_going", "maybe"];
    if (!validStatuses.includes(status as AttendanceStatus)) {
      return NextResponse.json({ error: "無効な出欠ステータスです" }, { status: 400 });
    }

    const newAttendance = await createOrUpdateAttendance(
      eventId,
      userId,
      status as AttendanceStatus,
      memo
    );

    if (!newAttendance) {
      return NextResponse.json({ error: "出欠の更新に失敗しました" }, { status: 500 });
    }

    return NextResponse.json(newAttendance);
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json({ error: "出欠の更新に失敗しました" }, { status: 500 });
  }
}
