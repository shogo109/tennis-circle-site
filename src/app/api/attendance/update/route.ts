import { NextResponse } from "next/server";
import { updateAttendance } from "@/lib/notion/attendance";
import { AttendanceStatus } from "@/lib/notion/attendance";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { eventId, userId, status } = body;

    if (!eventId || !userId || !status) {
      return NextResponse.json({ error: "必須パラメータが不足しています" }, { status: 400 });
    }

    // 出欠ステータスのバリデーション
    const validStatuses: AttendanceStatus[] = ["going", "not_going", "maybe"];
    if (!validStatuses.includes(status as AttendanceStatus)) {
      return NextResponse.json({ error: "無効な出欠ステータスです" }, { status: 400 });
    }

    const updatedAttendance = await updateAttendance(eventId, userId, status as AttendanceStatus);
    return NextResponse.json(updatedAttendance);
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json({ error: "出欠の更新に失敗しました" }, { status: 500 });
  }
}
