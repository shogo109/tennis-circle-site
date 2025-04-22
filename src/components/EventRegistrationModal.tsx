"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Location } from "@/types/location";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { ja } from "date-fns/locale";
import { parseISO, format } from "date-fns";

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventRegistered: () => void;
}

export default function EventRegistrationModal({
  isOpen,
  onClose,
  onEventRegistered,
}: EventRegistrationModalProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    locationId: "",
    startDate: "",
    startTime: null as Date | null,
    endDate: "",
    endTime: null as Date | null,
  });
  const [error, setError] = useState("");

  // 場所一覧を取得
  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/locations");
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setError("場所の取得に失敗しました");
    }
  };

  // モーダルが開かれた時に場所一覧を取得
  useEffect(() => {
    if (isOpen) {
      fetchLocations();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const startTimeStr = formData.startTime ? format(formData.startTime, "HH:mm") : "";
      const endTimeStr = formData.endTime ? format(formData.endTime, "HH:mm") : "";

      const startDateTime = `${formData.startDate}T${startTimeStr}:00+09:00`;
      const endDateTime =
        formData.endDate && endTimeStr ? `${formData.endDate}T${endTimeStr}:00+09:00` : null;

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationId: formData.locationId,
          startDate: startDateTime,
          endDate: endDateTime,
        }),
      });

      if (!response.ok) {
        throw new Error("登録に失敗しました");
      }

      onEventRegistered();
      onClose();
      setFormData({
        locationId: "",
        startDate: "",
        startTime: null,
        endDate: "",
        endTime: null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={ja}
    >
      <Transition.Root
        show={isOpen}
        as={Fragment}
      >
        <Dialog
          as="div"
          className="relative z-50"
          onClose={onClose}
          static
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all border border-green-100">
                  <div className="flex justify-between items-start mb-6">
                    <Dialog.Title className="text-lg font-bold text-tennis-court">
                      イベントを登録
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="text-tennis-court/70 hover:text-tennis-court"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-sm font-medium text-tennis-court mb-1">
                        場所
                      </label>
                      <select
                        value={formData.locationId}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, locationId: e.target.value }))
                        }
                        className="w-full rounded-lg border-2 border-green-100 bg-white shadow-sm focus:border-tennis-court focus:ring-tennis-court transition-colors duration-200"
                        required
                      >
                        <option value="">選択してください</option>
                        {locations.map((location) => (
                          <option
                            key={location.id}
                            value={location.id}
                          >
                            {location.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-tennis-court mb-1">
                          開始日
                        </label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                          }
                          className="w-full rounded-lg border-2 border-green-100 bg-white shadow-sm focus:border-tennis-court focus:ring-tennis-court transition-colors duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-tennis-court mb-1">
                          開始時刻
                        </label>
                        <TimePicker
                          value={formData.startTime}
                          onChange={(newValue) =>
                            setFormData((prev) => ({ ...prev, startTime: newValue }))
                          }
                          minutesStep={15}
                          ampm={false}
                          slotProps={{
                            textField: {
                              required: true,
                              className:
                                "w-full rounded-lg border-2 border-green-100 bg-white shadow-sm focus:border-tennis-court focus:ring-tennis-court transition-colors duration-200",
                            },
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-tennis-court mb-1">
                          終了日
                        </label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                          }
                          className="w-full rounded-lg border-2 border-green-100 bg-white shadow-sm focus:border-tennis-court focus:ring-tennis-court transition-colors duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-tennis-court mb-1">
                          終了時刻
                        </label>
                        <TimePicker
                          value={formData.endTime}
                          onChange={(newValue) =>
                            setFormData((prev) => ({ ...prev, endTime: newValue }))
                          }
                          minutesStep={15}
                          ampm={false}
                          slotProps={{
                            textField: {
                              className:
                                "w-full rounded-lg border-2 border-green-100 bg-white shadow-sm focus:border-tennis-court focus:ring-tennis-court transition-colors duration-200",
                            },
                          }}
                        />
                      </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-tennis-court bg-white border-2 border-tennis-court rounded-lg hover:bg-tennis-court/5 transition-colors duration-200"
                      >
                        キャンセル
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-tennis-court border-2 border-tennis-court rounded-lg hover:bg-tennis-court/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tennis-court disabled:opacity-50 transition-colors duration-200"
                      >
                        {isLoading ? "登録中..." : "登録する"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </LocalizationProvider>
  );
}
