"use client";

import { Location } from "@/types/location";

type Props = {
  location: Location;
};

export default function LocationMap({ location }: Props) {
  if (!location.map_url) {
    return (
      <div className="bg-gray-100 rounded-lg h-[300px] flex items-center justify-center">
        <p className="text-gray-500">地図情報がありません</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden">
      <iframe
        src={location.map_url}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
