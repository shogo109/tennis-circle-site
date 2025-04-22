"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Event } from "@/types/event";
import { AttendanceStatus } from "@/lib/notion/attendance";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import LocationModal from "@/components/LocationModal";
import { CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";

interface Props {
  // initialEventsは不要になりました
}

interface UserInfo {
  userId: string; // NotionのページID
  _id: number; // 数値のID
  username: string;
  display_name?: string;
}

interface User {
  id: string;
  username: string;
  display_name?: string;
}

// 日付フォーマット関数をコンポーネント内で定義
const formatEventDate = (dateStr: string | undefined) => {
  if (!dateStr) {
    return "";
  }

  const date = new Date(dateStr);
  return format(date, "M月d日(E) HH:mm", { locale: ja });
};

export default function AttendanceClient({}: Props) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [selectedEventForChange, setSelectedEventForChange] = useState<Event | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [attendanceMemo, setAttendanceMemo] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();

        // 現在の月と次の月のイベントのみをフィルタリング
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

        const filteredEvents = data.filter((event: Event) => {
          const eventDate = new Date(event.startDate);
          const eventMonth = eventDate.getMonth();
          const eventYear = eventDate.getFullYear();

          return (
            (eventMonth === currentMonth && eventYear === currentYear) ||
            (eventMonth === nextMonth && eventYear === nextMonthYear)
          );
        });

        // 日付でソート
        filteredEvents.sort(
          (a: Event, b: Event) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

        setEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // ユーザー情報の取得を詳細モーダルを開く時のみに変更
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const encodedData = sessionStorage.getItem("userInfo");
      if (!encodedData) {
        throw new Error("ユーザー情報が見つかりません");
      }

      const response = await fetch("/api/users", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-auth-user": encodedData,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // 詳細モーダルを開く時の処理
  const handleOpenModal = async (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    // ユーザー情報がまだ取得されていない場合のみ取得
    if (users.length === 0) {
      await fetchUsers();
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const encodedData = sessionStorage.getItem("userInfo");
      if (!encodedData) {
        router.push("/");
        return;
      }

      try {
        const decodedData = JSON.parse(decodeURIComponent(atob(encodedData)));

        // まずセッションストレージの情報をセット
        const initialUserInfo = {
          _id: decodedData._id,
          userId: "", // 後でNotionのページIDを設定
          username: decodedData.name,
          display_name: decodedData.display_name,
        };
        setUserInfo(initialUserInfo);

        // Notionユーザー情報を取得してIDを更新
        try {
          const response = await fetch("/api/users", {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "x-auth-user": encodedData,
            },
          });

          if (!response.ok) {
            const errorData = await response
              .json()
              .catch((e) => ({ error: "レスポンスの解析に失敗しました" }));
            throw new Error(`Failed to fetch users: ${errorData.error || response.statusText}`);
          }

          const users = await response.json();

          // 現在のユーザーのNotionページIDを探す
          const currentUser = users.find((user: any) => user._id === decodedData._id);

          if (currentUser?.id) {
            setUserInfo((prev) => ({
              ...prev,
              userId: currentUser.id,
              display_name: currentUser.display_name,
              username: currentUser.username,
            }));
          } else {
            throw new Error("ユーザー情報が見つかりません");
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      } catch (error) {
        console.error("Error processing user info");
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  const handleAttendanceUpdate = async (eventId: string, status: AttendanceStatus) => {
    setIsUpdating(eventId);
    try {
      if (!userInfo?.userId) {
        throw new Error("ユーザー情報が見つかりません");
      }

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          userId: userInfo.userId,
          status,
          memo: attendanceMemo.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "出欠の更新に失敗しました");
      }

      const updatedAttendance = await response.json();

      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          if (event.id === eventId) {
            const updatedAttendances = event.attendances || [];
            const existingIndex = updatedAttendances.findIndex((a) => a.userId === userInfo.userId);

            if (existingIndex >= 0) {
              updatedAttendances[existingIndex] = {
                ...updatedAttendances[existingIndex],
                status: updatedAttendance.status,
                memo: updatedAttendance.memo,
              };
            } else {
              updatedAttendances.push({
                userId: userInfo.userId,
                userName: userInfo.display_name || userInfo.username,
                status: updatedAttendance.status,
                memo: updatedAttendance.memo,
              });
            }

            return {
              ...event,
              attendances: updatedAttendances,
            };
          }
          return event;
        })
      );
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert(error instanceof Error ? error.message : "出欠の更新に失敗しました");
    } finally {
      setIsUpdating(null);
      setIsChangeModalOpen(false);
    }
  };

  const getStatusText = (status: AttendanceStatus) => {
    switch (status) {
      case "going":
        return "参加";
      case "not_going":
        return "不参加";
      case "maybe":
        return "検討中";
      default:
        return "";
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "going":
        return "bg-tennis-court text-white";
      case "not_going":
        return "bg-red-500 text-white";
      case "maybe":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status: AttendanceStatus | null) => {
    switch (status) {
      case "going":
        return <CheckCircleIcon className="h-6 w-6 text-tennis-court" />;
      case "not_going":
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case "maybe":
        return <QuestionMarkCircleIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <div className="h-6 w-6" />;
    }
  };

  // 出欠変更モーダルを開く
  const handleOpenChangeModal = (event: Event) => {
    setSelectedEventForChange(event);
    setIsChangeModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen || isChangeModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, isChangeModalOpen]);

  // eventsがnullの場合はローディング中
  if (events === null) {
    throw new Error("loading");
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">出欠確認</h1>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tennis-court"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-red-600">データの取得に失敗しました。</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-tennis-court text-white rounded-lg hover:bg-tennis-court/90 transition-colors"
          >
            再読み込み
          </button>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">イベントはありません</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const userAttendance = event.attendances?.find((a) => a.userId === userInfo?.userId);
            const isEventUpdating = isUpdating === event.id;

            return (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md p-6 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-lg font-medium">{formatEventDate(event.startDate)}</div>
                    {event.location?.id ? (
                      <button
                        onClick={() => {
                          setSelectedLocationId(event.location?.id || null);
                          setIsLocationModalOpen(true);
                        }}
                        className="text-gray-600 hover:text-tennis-court flex items-center gap-2 rounded-lg py-1 -ml-1 active:bg-gray-100"
                      >
                        <MapPinIcon className="h-5 w-5 text-tennis-court" />
                        <span className="underline underline-offset-2">
                          {event.location?.name || "場所未定"}
                        </span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-600 py-1">
                        <MapPinIcon className="h-5 w-5" />
                        <span>{event.location?.name || "場所未定"}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleOpenModal(event)}
                    className="text-tennis-court hover:text-tennis-court/80 text-sm"
                  >
                    詳細を見る
                  </button>
                </div>
                <div className="flex gap-2">
                  {userAttendance ? (
                    isEventUpdating ? (
                      <div className="px-4 py-2 text-sm text-gray-600">更新中...</div>
                    ) : (
                      <div className="flex gap-2">
                        <div
                          className={`px-4 py-2 rounded-lg text-sm ${getStatusColor(
                            userAttendance.status
                          )}`}
                        >
                          {getStatusText(userAttendance.status)}
                        </div>
                        <button
                          onClick={() => handleOpenChangeModal(event)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                        >
                          変更
                        </button>
                      </div>
                    )
                  ) : isEventUpdating ? (
                    <div className="px-4 py-2 text-sm text-gray-600">更新中...</div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAttendanceUpdate(event.id, "going")}
                        className="px-4 py-2 bg-tennis-court text-white rounded-lg text-sm hover:bg-tennis-court/90 transition-colors"
                      >
                        参加
                      </button>
                      <button
                        onClick={() => handleAttendanceUpdate(event.id, "not_going")}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                      >
                        不参加
                      </button>
                      <button
                        onClick={() => handleAttendanceUpdate(event.id, "maybe")}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition-colors"
                      >
                        検討中
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 詳細モーダル */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-auto my-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold">参加者一覧</h2>
              <div className="text-lg font-medium mt-2">
                {formatEventDate(selectedEvent.startDate)}
              </div>
              <div className="text-gray-600">
                {typeof selectedEvent.location === "string"
                  ? selectedEvent.location
                  : selectedEvent.location.name}
              </div>
            </div>

            {isLoadingUsers ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tennis-court"></div>
                <p className="text-gray-600">ユーザー情報を読み込み中...</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[60vh]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        名前
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        参加状況
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[300px]">
                        メモ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => {
                      const attendance = selectedEvent.attendances?.find(
                        (a) => a.userId === user.id
                      );
                      return (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-32">
                            {user.display_name?.trim() || user.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center w-24">
                            <div className="flex justify-center">
                              {getStatusIcon(attendance?.status || null)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 min-w-[300px]">
                            {attendance?.memo && (
                              <div className="break-words">{attendance.memo}</div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 flex flex-col space-y-4">
              <div className="flex gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-tennis-court" />
                  <span className="text-sm text-gray-600">参加</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-gray-600">不参加</span>
                </div>
                <div className="flex items-center gap-2">
                  <QuestionMarkCircleIcon className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">検討中</span>
                </div>
              </div>
              <div className="flex justify-center pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-tennis-court text-white rounded-lg hover:bg-tennis-court/90 transition-colors"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 出欠変更モーダル */}
      {isChangeModalOpen && selectedEventForChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-6">出欠を変更</h2>
            <div className="text-lg font-medium mb-2">
              {formatEventDate(selectedEventForChange.startDate)}
            </div>
            <div className="text-gray-600 mb-6">
              {typeof selectedEventForChange.location === "string"
                ? selectedEventForChange.location
                : selectedEventForChange.location.name}
            </div>
            {isUpdating === selectedEventForChange.id ? (
              <div className="text-center py-4 text-gray-600">更新中...</div>
            ) : (
              <>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleAttendanceUpdate(selectedEventForChange.id, "going")}
                    className="w-full px-4 py-3 bg-tennis-court text-white rounded-lg hover:bg-tennis-court/90 transition-colors"
                  >
                    参加
                  </button>
                  <button
                    onClick={() => handleAttendanceUpdate(selectedEventForChange.id, "not_going")}
                    className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    不参加
                  </button>
                  <button
                    onClick={() => handleAttendanceUpdate(selectedEventForChange.id, "maybe")}
                    className="w-full px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    検討中
                  </button>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-tennis-court focus:border-tennis-court"
                    rows={3}
                    placeholder="メモを入力（任意）"
                    value={attendanceMemo}
                    onChange={(e) => setAttendanceMemo(e.target.value)}
                  />
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsChangeModalOpen(false)}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {selectedLocationId && (
        <LocationModal
          locationId={selectedLocationId}
          isOpen={isLocationModalOpen}
          onClose={() => {
            setIsLocationModalOpen(false);
            setSelectedLocationId(null);
          }}
        />
      )}
    </div>
  );
}
