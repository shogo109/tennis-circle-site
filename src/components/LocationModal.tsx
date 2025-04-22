import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Location } from "@/types/location";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/solid";

interface LocationModalProps {
  locationId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationModal({ locationId, isOpen, onClose }: LocationModalProps) {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && locationId) {
      const fetchLocation = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/locations/${locationId}`);
          if (!response.ok) {
            throw new Error("場所の情報を取得できませんでした");
          }
          const data = await response.json();
          setLocation(data);
        } catch (error) {
          setError(error instanceof Error ? error.message : "エラーが発生しました");
        } finally {
          setIsLoading(false);
        }
      };

      fetchLocation();
    }
  }, [isOpen, locationId]);

  // Google Maps URLからembedリンクを生成
  const getEmbedMapUrl = (mapUrl: string) => {
    try {
      const url = new URL(mapUrl);
      return mapUrl
        .replace("maps/place", "maps/embed/v1/place")
        .replace("/data=", "?")
        .replace("@", "?q=")
        .replace(/\/([-\d.]+),([-\d.]+)/, "?q=$1,$2");
    } catch {
      return null;
    }
  };

  return (
    <Transition.Root
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">閉じる</span>
                    <XMarkIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex h-96 items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-tennis-court rounded-full border-t-transparent"></div>
                  </div>
                ) : error ? (
                  <div className="flex h-96 items-center justify-center">
                    <p className="text-red-500">{error}</p>
                  </div>
                ) : location ? (
                  <>
                    {location.map_url && getEmbedMapUrl(location.map_url) && (
                      <div className="aspect-video w-full">
                        <iframe
                          src={getEmbedMapUrl(location.map_url)}
                          className="w-full h-full border-0"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                      </div>
                    )}
                    <div className="px-6 py-4 sm:px-8">
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-semibold text-gray-900"
                      >
                        {location.name}
                      </Dialog.Title>
                      {location.address && (
                        <div className="mt-4 flex items-start gap-2 text-gray-600">
                          <MapPinIcon className="h-5 w-5 flex-shrink-0 text-tennis-court" />
                          <p>{location.address}</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
