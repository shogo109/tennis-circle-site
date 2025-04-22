"use client";

import { useState, useRef } from "react";
import { Location } from "@/types/location";
import LocationMap from "./LocationMap";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type LocationCategoryProps = {
  category: string;
  locations: Location[];
};

export default function LocationCategory({ category, locations }: LocationCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    // 折りたたむ時のみスクロール位置を調整
    if (isExpanded) {
      setTimeout(() => {
        const yOffset = -80; // ヘッダーの高さ分のオフセット
        const element = headerRef.current;
        if (element) {
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 0);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-visible">
      <div
        ref={headerRef}
        className="sticky top-16 z-20"
      >
        <button
          onClick={handleToggle}
          className="w-full px-6 py-4 flex items-center justify-between bg-primary-100 hover:bg-primary-200 transition-colors shadow-sm"
        >
          <h2 className="text-2xl font-semibold text-tennis-court">
            {category}
            <span className="ml-2 text-sm text-gray-600">({locations.length}箇所)</span>
          </h2>
          <ChevronDownIcon
            className={`w-6 h-6 text-tennis-court transition-transform ${
              isExpanded ? "transform rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-accent-500 p-4"
            >
              <h3 className="text-xl font-semibold mb-2 text-tennis-court">
                {location.name || "名称なし"}
              </h3>
              <p className="text-gray-600 mb-4">{location.address || "住所なし"}</p>
              <div className="mb-4">
                <LocationMap location={location} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
