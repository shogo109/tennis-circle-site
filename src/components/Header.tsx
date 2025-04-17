"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import LoginModal from "./LoginModal";
import { useRouter } from "next/navigation";

interface UserInfo {
  _id: string;
  name: string;
  admin: boolean;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // ログイン状態の確認
    const userInfoStr = sessionStorage.getItem("userInfo");
    if (userInfoStr) {
      try {
        const decodedData = atob(userInfoStr);
        const userInfo: UserInfo = JSON.parse(decodeURIComponent(decodedData));
        setUsername(userInfo.name);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user info:", error);
        handleLogout();
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = (username: string) => {
    setUsername(username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userInfo");
    setUsername("");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div className="h-16">
      {" "}
      {/* ヘッダーの高さ分のスペースを確保 */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled ? "bg-white shadow-sm" : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="container">
          <div className="flex justify-between items-center h-16">
            {/* ロゴ */}
            <Link
              href="/"
              className="flex items-center space-x-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-tennis-court/5 flex items-center justify-center group-hover:bg-tennis-court/10 transition-colors">
                <span className="text-2xl">🎾</span>
              </div>
              <span className="text-xl font-bold text-tennis-court transition-colors">
                Joy'n Tennis
              </span>
            </Link>

            {/* デスクトップナビゲーション */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link
                href="/schedule"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-tennis-court transition-colors"
              >
                開催予定
              </Link>
              <Link
                href="/locations"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-tennis-court transition-colors"
              >
                開催場所
              </Link>
              {isLoggedIn && (
                <Link
                  href="/attendance"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-tennis-court transition-colors"
                >
                  出欠確認
                </Link>
              )}
              <Link
                href="#features"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-tennis-court transition-colors"
              >
                特徴
              </Link>
              <Link
                href="#contact"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-tennis-court transition-colors"
              >
                お問い合わせ
              </Link>
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-tennis-court">{username}さん</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    ログアウト
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-tennis-court hover:bg-tennis-court/5 rounded-lg transition-colors"
                >
                  ログイン
                </button>
              )}
              <Link
                href="/apply"
                className="bg-accent-500 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-accent-600 transition-colors"
              >
                参加申し込み
              </Link>
            </nav>

            {/* モバイルメニューボタン */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-tennis-court/60 hover:text-tennis-court hover:bg-tennis-court/5 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">メニューを開く</span>
              {!isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:hidden bg-white/95 backdrop-blur-md border-t border-tennis-court/10`}
        >
          <div className="container py-2 space-y-1">
            <Link
              href="/schedule"
              className="block text-gray-600 hover:text-tennis-court hover:bg-tennis-court/5 px-4 py-2 text-sm font-medium transition-colors rounded-lg"
            >
              開催予定
            </Link>
            <Link
              href="/locations"
              className="block text-gray-600 hover:text-tennis-court hover:bg-tennis-court/5 px-4 py-2 text-sm font-medium transition-colors rounded-lg"
            >
              開催場所
            </Link>
            {isLoggedIn && (
              <Link
                href="/attendance"
                className="block text-gray-600 hover:text-tennis-court hover:bg-tennis-court/5 px-4 py-2 text-sm font-medium transition-colors rounded-lg"
              >
                出欠確認
              </Link>
            )}
            <Link
              href="#features"
              className="block text-gray-600 hover:text-tennis-court hover:bg-tennis-court/5 px-4 py-2 text-sm font-medium transition-colors rounded-lg"
            >
              特徴
            </Link>
            <Link
              href="#contact"
              className="block text-gray-600 hover:text-tennis-court hover:bg-tennis-court/5 px-4 py-2 text-sm font-medium transition-colors rounded-lg"
            >
              お問い合わせ
            </Link>
            {isLoggedIn ? (
              <>
                <div className="px-4 py-2 text-sm font-medium text-tennis-court">
                  {username}さん
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-600 hover:text-tennis-court hover:bg-tennis-court/5 px-4 py-2 text-sm font-medium transition-colors rounded-lg"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="block w-full text-left text-tennis-court hover:bg-tennis-court/5 px-4 py-2 text-sm font-medium transition-colors rounded-lg"
              >
                ログイン
              </button>
            )}
            <Link
              href="/apply"
              className="block bg-accent-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-accent-600 transition-colors mt-4 text-center mx-4"
            >
              参加申し込み
            </Link>
          </div>
        </div>
      </header>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
