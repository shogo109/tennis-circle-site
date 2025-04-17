import { Location } from "./location";
import { AttendanceStatus } from "@/lib/notion/attendance";

export type EventCategory = "練習" | "試合" | "その他";

export type Event = {
  id: string;
  _id: number;
  notionPageId: string;
  startDate: string; // 開始時間
  endDate: string; // 終了時間
  location: Location;
  category: EventCategory;
  myAttendance?: AttendanceStatus;
  attendances?: Array<{
    userId: string;
    userName: string;
    status: AttendanceStatus;
  }>;
};
