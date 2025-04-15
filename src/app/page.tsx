"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* ヒーローセクション */}
        <div className="relative h-[70vh] overflow-hidden">
          {/* 背景画像 */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2940"
              alt="テニスコート"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-tennis-court/80 to-primary-600/80" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-tennis-ball/30 flex items-center justify-center bg-tennis-court/20 backdrop-blur-sm">
              <span className="text-6xl">🎾</span>
            </div>
          </div>
          <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
            <h1 className="text-5xl font-bold text-center mb-4 tracking-tight text-tennis-line drop-shadow-lg">
              Joy'n Tennis
            </h1>
            <p className="text-xl text-center mb-8 text-tennis-line/90 drop-shadow-md">
              名古屋で楽しくテニス！
            </p>
            <div className="space-y-4">
              <Link
                href="/locations"
                className="block bg-accent-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-accent-600 transition-colors text-center"
              >
                開催場所を確認
              </Link>
              <Link
                href="#features"
                className="block bg-tennis-court/20 backdrop-blur-sm text-tennis-line px-8 py-4 rounded-xl font-bold hover:bg-tennis-court/30 transition-colors text-center border-2 border-tennis-line/30"
              >
                サークルについて
              </Link>
            </div>
          </div>
        </div>

        {/* 特徴セクション */}
        <section
          id="features"
          className="px-4 py-16 bg-gradient-to-b from-primary-50 to-white"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2 text-tennis-court">
              サークルの特徴
            </h2>
            <p className="text-center text-gray-600 mb-12">楽しく、安全に、みんなでテニス</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                title="初心者歓迎"
                description="基礎からしっかりサポート。経験者から丁寧にアドバイスが受けられます。"
                icon="🎾"
              />
              <FeatureCard
                title="フレキシブルな開催"
                description="予約可能なコートで随時開催。参加したい時に気軽に参加できます。"
                icon="📅"
              />
              <FeatureCard
                title="充実した設備"
                description="人工芝コートで快適にプレー。雨天時は室内コートを利用します。"
                icon="🏸"
              />
            </div>
          </div>
        </section>

        {/* 参加方法セクション */}
        <section className="px-4 py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2 text-tennis-court">参加方法</h2>
            <p className="text-center text-gray-600 mb-12">簡単3ステップで参加できます</p>
            <div className="max-w-3xl mx-auto space-y-8">
              <Step
                number={1}
                title="開催予定を確認"
                description={
                  <Link
                    href="/schedule"
                    className="text-accent-500 hover:text-accent-600 underline"
                  >
                    カレンダーから開催日を確認
                  </Link>
                }
              />
              <Step
                number={2}
                title="開催場所を確認"
                description={
                  <Link
                    href="/locations"
                    className="text-accent-500 hover:text-accent-600 underline"
                  >
                    活動場所の詳細をチェック
                  </Link>
                }
              />
              <Step
                number={3}
                title="フォームから申し込み"
                description={
                  <Link
                    href="/apply"
                    className="text-accent-500 hover:text-accent-600 underline"
                  >
                    必要事項を入力して完了
                  </Link>
                }
              />
            </div>
          </div>
        </section>

        {/* お問い合わせセクション */}
        <section
          id="contact"
          className="relative px-4 py-16 overflow-hidden"
        >
          {/* 背景画像 */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2940"
              alt="テニスボール"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-tennis-court/90 to-primary-600/80" />
          </div>
          <div className="relative max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-tennis-line drop-shadow-lg">
              お気軽にお問い合わせください
            </h2>
            <p className="mb-8 text-tennis-line/90 drop-shadow-md">
              ご不明な点があればお問い合わせください
            </p>
            <Link
              href="/contact"
              className="inline-block bg-accent-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-accent-600 transition-colors"
            >
              お問い合わせ
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-4 border-accent-500">
      <div className="text-5xl mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4 text-tennis-court">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <div className="flex items-start space-x-6">
      <div className="w-12 h-12 bg-gradient-to-br from-tennis-court to-primary-600 text-tennis-line rounded-2xl flex items-center justify-center font-bold text-xl shadow-md">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-bold text-tennis-court mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
