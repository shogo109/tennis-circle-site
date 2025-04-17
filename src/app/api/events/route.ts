import { NextResponse } from "next/server";
import { getEvents, createEvent } from "@/lib/notion/events";
import { getAttendancesByEventDateId } from "@/lib/notion/attendance";

export async function GET() {
  try {
    const events = await getEvents();

    // 各イベントの出欠情報を取得
    const eventsWithAttendance = await Promise.all(
      events.map(async (event) => {
        const attendances = await getAttendancesByEventDateId(event.id);
        return {
          ...event,
          attendances: attendances.map((attendance) => ({
            userId: attendance.userId,
            userName: attendance.userId,
            status: attendance.status,
          })),
        };
      })
    );

    return NextResponse.json(eventsWithAttendance);
  } catch (error) {
    console.error("Error in events API:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { locationId, startDate, endDate } = body;

    // イベントを作成
    const event = await createEvent(locationId, startDate, endDate);

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "イベントの登録に失敗しました" }, { status: 500 });
  }
}
