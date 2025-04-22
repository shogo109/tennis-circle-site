"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type LocationFormProps = {
  onLocationAdded: () => void;
};

export default function LocationForm({ onLocationAdded }: LocationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    locationName: "",
    address: "",
    category: "",
    newCategory: "",
    tell: "",
    mapUrl: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // カテゴリー一覧を取得
    fetch("/api/locations")
      .then((res) => res.json())
      .then((data) => {
        // データをカテゴリーごとにグループ化
        const categories = data.map((location: { category: string }) => location.category);
        const uniqueCategories = Array.from(new Set<string>(categories));
        setCategories(uniqueCategories);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleMapUrlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    try {
      // iframeタグからsrc属性の値を抽出
      const srcMatch = value.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        setFormData((prev) => ({
          ...prev,
          mapUrl: srcMatch[1],
        }));
      } else {
        // srcが見つからない場合は、入力値をそのまま使用（URLが直接入力された場合）
        setFormData((prev) => ({
          ...prev,
          mapUrl: value,
        }));
      }
    } catch (err) {
      console.error("Error parsing map URL:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationName: formData.locationName,
          address: formData.address,
          category: formData.category || formData.newCategory,
          tell: formData.tell,
          mapUrl: formData.mapUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("登録に失敗しました");
      }

      // 登録成功後、フォームをリセット
      setFormData({
        locationName: "",
        address: "",
        category: "",
        newCategory: "",
        tell: "",
        mapUrl: "",
      });
      setSuccess(true);

      // 親コンポーネントに通知
      onLocationAdded();

      // 3秒後に成功メッセージを消す
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow-lg relative"
    >
      {success && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 text-green-700 px-6 py-4 rounded-lg flex items-center gap-3 animate-fade shadow-lg border border-green-200 min-w-[300px] max-w-[90%]">
          <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-green-500" />
          <div>
            <p className="font-medium">場所の登録が完了しました</p>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-tennis-court mb-6">新規場所登録</h2>

      <div>
        <label
          htmlFor="locationName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          場所名 *
        </label>
        <input
          type="text"
          id="locationName"
          name="locationName"
          required
          value={formData.locationName}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          住所 *
        </label>
        <input
          type="text"
          id="address"
          name="address"
          required
          value={formData.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          カテゴリー *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">新しいカテゴリーを作成</option>
          {categories.map((cat) => (
            <option
              key={cat}
              value={cat}
            >
              {cat}
            </option>
          ))}
        </select>
      </div>

      {!formData.category && (
        <div>
          <label
            htmlFor="newCategory"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            新しいカテゴリー名 *
          </label>
          <input
            type="text"
            id="newCategory"
            name="newCategory"
            required={!formData.category}
            value={formData.newCategory}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="tell"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          電話番号
        </label>
        <input
          type="tel"
          id="tell"
          name="tell"
          value={formData.tell}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Google Maps URL
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          value={formData.mapUrl}
          onChange={handleMapUrlChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-tennis-court focus:border-transparent"
          rows={4}
          placeholder="Google MapsのiframeコードまたはURLを貼り付けてください"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Google
          Mapsで場所を検索し、「共有」→「地図を埋め込む」からiframeコードをコピーして貼り付けてください。
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-tennis-court text-white py-2 px-4 rounded-md hover:bg-tennis-court-dark transition-colors disabled:bg-gray-400"
      >
        {isLoading ? "登録中..." : "登録する"}
      </button>
    </form>
  );
}
