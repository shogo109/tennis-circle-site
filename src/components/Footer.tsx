"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-tennis-court">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* ロゴとサークル説明 */}
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-2xl">🎾</span>
              </div>
              <span className="text-xl font-bold text-tennis-line">Joy'n Tennis</span>
            </div>
            <p className="text-tennis-line/80 text-base">
              名古屋市を中心に活動する、アットホームなテニスサークルです。初心者から経験者まで、幅広い方々が参加しています。
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-tennis-line/60 hover:text-tennis-line transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-tennis-line/60 hover:text-tennis-line transition-colors"
              >
                <span className="sr-only">LINE</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </a>
            </div>
          </div>

          {/* リンク */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-tennis-line/80 tracking-wider uppercase">
                  サークルについて
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/about"
                      className="text-base text-tennis-line/60 hover:text-tennis-line transition-colors"
                    >
                      サークル紹介
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/locations"
                      className="text-base text-tennis-line/60 hover:text-tennis-line transition-colors"
                    >
                      開催場所
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/schedule"
                      className="text-base text-tennis-line/60 hover:text-tennis-line transition-colors"
                    >
                      活動予定
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-tennis-line/80 tracking-wider uppercase">
                  参加について
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/apply"
                      className="text-base text-tennis-line/60 hover:text-tennis-line transition-colors"
                    >
                      参加申し込み
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="text-base text-tennis-line/60 hover:text-tennis-line transition-colors"
                    >
                      よくある質問
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-base text-tennis-line/60 hover:text-tennis-line transition-colors"
                    >
                      お問い合わせ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-tennis-line/20 pt-8">
          <p className="text-base text-tennis-line/60 xl:text-center">
            © 2024 Joy'n Tennis. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
