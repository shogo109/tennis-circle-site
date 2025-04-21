import { useState, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (newUsername: string, newDisplayName: string) => void;
  currentDisplayName: string;
  username: string;
}

export default function UserEditModal({
  isOpen,
  onClose,
  onUpdate,
  currentDisplayName,
  username,
}: Props) {
  const [newUsername, setNewUsername] = useState(username);
  const [displayName, setDisplayName] = useState(currentDisplayName);
  const [isUpdating, setIsUpdating] = useState(false);

  // モーダルが開くたびに現在の値で初期化
  useEffect(() => {
    if (isOpen) {
      setNewUsername(username);
      setDisplayName(currentDisplayName);
    }
  }, [isOpen, username, currentDisplayName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 値が変更されていない場合は更新しない
    if (newUsername === username && displayName === currentDisplayName) {
      onClose();
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_username: username,
          username: newUsername.trim(),
          display_name: displayName.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "更新に失敗しました");
      }

      const data = await response.json();

      // セッションストレージの更新
      const userInfoStr = sessionStorage.getItem("userInfo");
      if (userInfoStr) {
        const decodedData = atob(userInfoStr);
        const userInfo = JSON.parse(decodeURIComponent(decodedData));
        const updatedUserInfo = {
          ...userInfo,
          name: newUsername.trim(),
          display_name: displayName.trim(),
        };
        sessionStorage.setItem(
          "userInfo",
          btoa(encodeURIComponent(JSON.stringify(updatedUserInfo)))
        );
      }

      onUpdate(newUsername, displayName);
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      alert(error instanceof Error ? error.message : "ユーザー情報の更新に失敗しました");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-6">ユーザー情報の編集</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ユーザー名</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tennis-court focus:border-tennis-court"
              placeholder="ユーザー名を入力"
              required
            />
            <p className="mt-1 text-sm text-gray-500">※ログイン時に使用する名前です</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">表示名</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tennis-court focus:border-tennis-court"
              placeholder="表示名を入力"
              required
            />
            <p className="mt-1 text-sm text-gray-500">※他のユーザーに表示される名前です</p>
          </div>
          <div className="flex flex-col gap-2 pt-4">
            <button
              type="submit"
              disabled={
                isUpdating || (newUsername === username && displayName === currentDisplayName)
              }
              className="w-full px-4 py-2 bg-tennis-court text-white rounded-lg hover:bg-tennis-court/90 transition-colors disabled:bg-gray-400"
            >
              {isUpdating ? "更新中..." : "更新"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
