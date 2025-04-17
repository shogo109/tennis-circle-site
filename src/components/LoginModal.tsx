"use client";

import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string) => void;
}

interface UserInfo {
  _id: string;
  name: string;
  admin: boolean;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    // ユーザー名から全ての空白を削除
    const normalizedUsername = username.replace(/\s+/g, "");
    console.log("Normalized username:", normalizedUsername);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: normalizedUsername, password }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        setError(data.error);
        return;
      }

      // ユーザー情報をエンコード
      const userInfo: UserInfo = {
        _id: data._id,
        name: data.name,
        admin: data.admin,
      };
      console.log("User info before encoding:", userInfo);

      const jsonString = JSON.stringify(userInfo);
      console.log("JSON string:", jsonString);

      const encodedJson = encodeURIComponent(jsonString);
      console.log("URL encoded:", encodedJson);

      const encodedData = btoa(encodedJson);
      console.log("Base64 encoded:", encodedData);

      sessionStorage.setItem("userInfo", encodedData);

      // 保存されたデータを確認
      const savedData = sessionStorage.getItem("userInfo");
      console.log("Saved data:", savedData);

      if (savedData) {
        const decodedData = atob(savedData);
        console.log("Decoded data:", decodedData);
        const parsedData = JSON.parse(decodeURIComponent(decodedData));
        console.log("Parsed data:", parsedData);
      }

      setSuccessMessage(`${data.name}さん、ようこそ！`);

      // 1秒後にモーダルを閉じる
      setTimeout(() => {
        onLogin(data.name);
        onClose();
      }, 1000);
    } catch (error) {
      setError("ログイン中にエラーが発生しました");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 入力時に全ての空白を削除
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value.replace(/\s+/g, ""));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-tennis-court mb-6">ログイン</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              お名前
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tennis-court focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tennis-court focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && (
            <p className="text-tennis-court text-sm font-medium text-center">{successMessage}</p>
          )}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isLoading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-tennis-court text-white rounded-lg hover:bg-tennis-court/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "ログイン中..." : "ログイン"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
