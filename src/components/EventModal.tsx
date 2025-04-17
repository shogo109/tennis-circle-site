"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { MapPinIcon, ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Event } from "@/types/event";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  categoryColors: Record<string, string>;
}

export default function EventModal({ event, isOpen, onClose, categoryColors }: EventModalProps) {
  if (!event) return null;

  return (
    <Transition
      show={isOpen}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Dialog.Title className="text-lg font-medium">{event.location.name}</Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ClockIcon className="h-5 w-5 text-tennis-court" />
                    <div>
                      <div>
                        {format(new Date(event.startDate), "M月d日(E) HH:mm", {
                          locale: ja,
                        })}
                      </div>
                      {event.endDate && (
                        <div>
                          ～{" "}
                          {format(new Date(event.endDate), "M月d日(E) HH:mm", {
                            locale: ja,
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPinIcon className="h-5 w-5 text-tennis-court flex-shrink-0" />
                    <div>
                      <div>{event.location.name}</div>
                      {event.location.address && (
                        <div className="text-sm text-gray-500">{event.location.address}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-1 text-sm rounded-full"
                      style={{
                        backgroundColor: categoryColors[event.location.category] + "20",
                        color: categoryColors[event.location.category],
                      }}
                    >
                      {event.location.category}
                    </span>
                  </div>

                  {event.location.map_url && (
                    <div className="mt-4">
                      <iframe
                        src={event.location.map_url}
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
