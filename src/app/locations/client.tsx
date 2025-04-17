"use client";

import { useState, useEffect } from "react";
import { Location } from "@/types/location";
import LocationCategory from "@/components/LocationCategory";
import LocationForm from "@/components/LocationForm";

interface UserInfo {
  _id: string;
  name: string;
  admin: boolean;
}

export default function LocationsClient() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // ユーザーの管理者権限を確認
    const userInfoStr = sessionStorage.getItem("userInfo");
    if (userInfoStr) {
      try {
        const decodedData = atob(userInfoStr);
        const userInfo: UserInfo = JSON.parse(decodeURIComponent(decodedData));
        setIsAdmin(userInfo.admin);
      } catch (error) {
        console.error("Error parsing user info:", error);
        setIsAdmin(false);
      }
    }
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/locations");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "データの取得に失敗しました");
      }

      if (!Array.isArray(data)) {
        throw new Error("不正なデータ形式です");
      }

      setLocations(data);
      setError(null);
    } catch (err) {
      console.error("Error in LocationsClient:", err);
      setError(err instanceof Error ? err.message : "データの取得中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // カテゴリーごとにグループ化
  const locationsByCategory = locations.reduce((acc, location) => {
    const category = location.category || "その他";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(location);
    return acc;
  }, {} as Record<string, Location[]>);

  if (isLoading) {
    return (
      <div className="bg-primary-50">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600 text-lg">データを読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-primary-50">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-red-500 text-lg">
              {error}
              <br />
              しばらく経ってから再度お試しください。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 場所一覧 */}
          <div className={isAdmin ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="space-y-6">
              {Object.entries(locationsByCategory).map(([category, locations]) => (
                <LocationCategory
                  key={category}
                  category={category}
                  locations={locations}
                />
              ))}
            </div>
          </div>

          {/* 登録フォーム（管理者のみ表示） */}
          {isAdmin && (
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <LocationForm onLocationAdded={fetchLocations} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
