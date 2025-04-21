"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  subMonths,
  startOfMonth,
  isSameMonth,
  isAfter,
  isBefore,
} from "date-fns";
import { ja } from "date-fns/locale";
import "@/styles/calendar.css";
import { Event } from "@/types/event";
import { useMemo, useState, useEffect } from "react";
import EventModal from "./EventModal";
import EventRegistrationModal from "./EventRegistrationModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

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
  const [currentDate, setCurrentDate] = useState(new Date());

  // 現在の月を基準に、表示可能な範囲を計算
  const today = useMemo(() => startOfMonth(new Date()), []);
  const minDate = useMemo(() => startOfMonth(subMonths(today, 1)), [today]);
  const maxDate = useMemo(() => startOfMonth(addMonths(today, 1)), [today]);

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
    previous: "前月",
    next: "翌月",
    today: "今月",
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

  const handleNavigate = (newDate: Date) => {
    const newMonth = startOfMonth(newDate);
    // 範囲内の日付であれば更新
    if (
      (isSameMonth(newMonth, minDate) || isAfter(newMonth, minDate)) &&
      (isSameMonth(newMonth, maxDate) || isBefore(newMonth, maxDate))
    ) {
      setCurrentDate(newDate);
    }
  };

  return (
    <>
      <div className="h-[600px] md:h-[800px] font-sans relative">
        <div className="absolute top-8 right-0 z-10">
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
          date={currentDate}
          onNavigate={handleNavigate}
          tooltipAccessor={(event) => `${event.title}\n${format(event.start, "yyyy/MM/dd")}`}
          className="bg-white rounded-lg shadow-sm"
          dayPropGetter={customDayPropGetter}
          eventPropGetter={(event) => ({
            style: event.style,
          })}
          onSelectEvent={handleSelectEvent}
          popup
          components={{
            toolbar: (props) => {
              const currentMonth = startOfMonth(props.date);
              // 現在の表示月が範囲内かどうかをチェック
              const isPrevDisabled = isBefore(currentMonth, minDate);
              const isNextDisabled = isAfter(currentMonth, maxDate);

              return (
                <div className="rbc-toolbar bg-primary-50 rounded-t-lg -mt-2">
                  <div className="flex justify-between items-center py-0.5 px-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => props.onNavigate("PREV")}
                        className={`p-1 rounded ${
                          isPrevDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
                        }`}
                        disabled={isPrevDisabled}
                        aria-label="前月"
                      >
                        <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => props.onNavigate("TODAY")}
                        className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded"
                      >
                        今月
                      </button>
                      <button
                        onClick={() => props.onNavigate("NEXT")}
                        className={`p-1 rounded ${
                          isNextDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
                        }`}
                        disabled={isNextDisabled}
                        aria-label="翌月"
                      >
                        <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center py-1.5">
                    <span className="text-lg font-bold">
                      {format(props.date, "yyyy年M月", { locale: ja })}
                    </span>
                  </div>
                </div>
              );
            },
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
