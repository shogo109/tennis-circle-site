"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ja } from "date-fns/locale";
import "@/styles/calendar.css";
import { Event } from "@/types/event";
import { useMemo, useState, useEffect } from "react";
import EventModal from "./EventModal";
import EventRegistrationModal from "./EventRegistrationModal";
import { PlusIcon } from "@heroicons/react/24/outline";

const locales = {
  ja: ja,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// カテゴリーごとの色のパレット
const colorPalette = [
  "#4CAF50", // 緑
  "#F44336", // 赤
  "#2196F3", // 青
  "#FF9800", // オレンジ
  "#9C27B0", // 紫
  "#00BCD4", // シアン
  "#795548", // 茶色
  "#607D8B", // ブルーグレー
];

interface Props {
  events: Event[];
}

export default function EventCalendar({ events: initialEvents }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [events, setEvents] = useState(initialEvents);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // ユーザーの管理者権限を確認
    const userInfoStr = sessionStorage.getItem("userInfo");
    if (userInfoStr) {
      try {
        const decodedData = atob(userInfoStr);
        const userInfo = JSON.parse(decodeURIComponent(decodedData));
        setIsAdmin(userInfo.admin);
      } catch (error) {
        console.error("Error parsing user info:", error);
        setIsAdmin(false);
      }
    }
  }, []);

  // イベント一覧を再取得
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // カテゴリーごとの色を動的に生成
  const categoryColors = useMemo(() => {
    const uniqueCategories = Array.from(new Set(events.map((event) => event.location.category)));
    return uniqueCategories.reduce((acc, category, index) => {
      acc[category] = colorPalette[index % colorPalette.length];
      return acc;
    }, {} as Record<string, string>);
  }, [events]);

  // イベントの表示形式を変換
  const calendarEvents = events.map((event) => ({
    title: event.location.name,
    start: new Date(event.startDate),
    end: event.endDate ? new Date(event.endDate) : new Date(event.startDate),
    resource: event,
    style: {
      backgroundColor:
        categoryColors[event.location.category] || colorPalette[colorPalette.length - 1],
    },
  }));

  const messages = {
    noEventsInRange: "この期間に予定はありません",
    showMore: (total: number) => `他${total}件`,
  };

  const handleSelectEvent = (calendarEvent: any) => {
    setSelectedEvent(calendarEvent.resource);
    setIsModalOpen(true);
  };

  const customDayPropGetter = (date: Date) => {
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return {
        className: "current-day",
        style: {
          backgroundColor: "#f0fdf4",
        },
      };
    }
    return {};
  };

  return (
    <>
      <div className="h-[600px] md:h-[800px] font-sans relative">
        <div className="absolute -top-2 right-0 z-10">
          {isAdmin && (
            <button
              onClick={() => setIsRegistrationModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-tennis-court rounded-lg hover:bg-tennis-court/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tennis-court"
            >
              <PlusIcon className="h-5 w-5" />
              <span>新規登録</span>
            </button>
          )}
        </div>

        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          messages={messages}
          views={["month"]}
          defaultView="month"
          tooltipAccessor={(event) => `${event.title}\n${format(event.start, "yyyy/MM/dd")}`}
          className="bg-white rounded-lg shadow-sm"
          dayPropGetter={customDayPropGetter}
          eventPropGetter={(event) => ({
            style: event.style,
          })}
          onSelectEvent={handleSelectEvent}
          popup
          components={{
            toolbar: (props) => (
              <div className="rbc-toolbar bg-primary-50 p-3 rounded-t-lg">
                <span className="text-lg font-bold text-center w-full">
                  {format(props.date, "yyyy年M月", { locale: ja })}
                </span>
              </div>
            ),
          }}
        />
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryColors={categoryColors}
      />

      <EventRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onEventRegistered={() => {
          fetchEvents();
          setIsRegistrationModalOpen(false);
        }}
      />
    </>
  );
}
