import { useState } from "react";

interface Props {
  onUserAdded: () => void;
}

export default function UserForm({ onUserAdded }: Props) {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userInfoStr = sessionStorage.getItem("userInfo");
      if (!userInfoStr) {
        throw new Error("認証情報がありません");
      }

      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-user": userInfoStr,
        },
        body: JSON.stringify({
          name,
          display_name: displayName,
          admin: isAdmin ? 1 : 0,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "ユーザーの登録に失敗しました");
      }

      setName("");
      setDisplayName("");
      setIsAdmin(false);
      onUserAdded();
    } catch (err) {
      console.error("Error in UserForm:", err);
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">新規ユーザー登録</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              本名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-tennis-court focus:border-tennis-court"
              required
            />
          </div>
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              表示名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-tennis-court focus:border-tennis-court"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="h-4 w-4 text-tennis-court focus:ring-tennis-court border-gray-300 rounded"
            />
            <label
              htmlFor="isAdmin"
              className="ml-2 block text-sm text-gray-700"
            >
              管理者権限を付与
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-tennis-court text-white py-2 px-4 rounded-lg font-medium hover:bg-tennis-court/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tennis-court disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "登録中..." : "登録する"}
          </button>
        </div>
      </form>
    </div>
  );
}
