"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ja } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/styles/calendar.css";
import { Event } from "@/types/event";

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

interface Props {
  events: Event[];
}

const formatDate = (date: Date) => {
  return format(date, "M月d日(E) HH:mm", { locale: ja });
};

export default function EventCalendar({ events }: Props) {
  const formattedEvents = events.map((event) => ({
    ...event,
    start: new Date(event.startDate),
    end: new Date(event.endDate || event.startDate),
    title: `${format(new Date(event.startDate), "M月d日(E) HH:mm", { locale: ja })} ${
      event.location?.name || ""
    }`,
  }));

  const messages = {
    today: "今日",
    previous: "前へ",
    next: "次へ",
    month: "月",
    week: "週",
    day: "日",
    agenda: "予定一覧",
    date: "日付",
    time: "時間",
    event: "イベント",
    noEventsInRange: "この期間に予定はありません",
    allDay: "終日",
    work_week: "稼働週",
    yesterday: "昨日",
    tomorrow: "明日",
    showMore: (total: number) => `他${total}件`,
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

  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor: "#4ade80",
        borderRadius: "8px",
        opacity: 0.8,
        color: "white",
        border: "none",
        display: "block",
        padding: "2px 5px",
      },
    };
  };

  return (
    <div className="h-[600px] font-sans">
      <Calendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        views={["month", "agenda"]}
        defaultView="month"
        tooltipAccessor={(event) => `${event.title}\n${format(event.start, "yyyy/MM/dd")}`}
        className="bg-white rounded-lg shadow-sm"
        dayPropGetter={customDayPropGetter}
        eventPropGetter={eventStyleGetter}
        popup
        components={{
          toolbar: (props) => (
            <div className="rbc-toolbar bg-primary-50 p-3 rounded-t-lg">
              <span className="rbc-btn-group">
                <button
                  type="button"
                  onClick={() => props.onNavigate("PREV")}
                >
                  前へ
                </button>
                <button
                  type="button"
                  onClick={() => props.onNavigate("TODAY")}
                >
                  今日
                </button>
                <button
                  type="button"
                  onClick={() => props.onNavigate("NEXT")}
                >
                  次へ
                </button>
              </span>
              <span className="rbc-toolbar-label text-lg font-bold">{props.label}</span>
              <span className="rbc-btn-group">
                {props.views.map((view) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => props.onView(view)}
                    className={view === props.view ? "rbc-active" : ""}
                  >
                    {messages[view]}
                  </button>
                ))}
              </span>
            </div>
          ),
        }}
      />
    </div>
  );
}
