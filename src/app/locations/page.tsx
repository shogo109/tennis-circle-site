import Image from "next/image";
import LocationsClient from "./client";

export const revalidate = 3600; // 1時間ごとに再検証

export default function LocationsPage() {
  return (
    <main className="min-h-screen">
      {/* ヒーローセクション */}
      <div className="relative h-[40vh] min-h-[400px]">
        {/* 背景画像 */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070"
            alt="テニスコート"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-tennis-court/90 to-primary-600/80" />
        </div>

        {/* コンテンツ */}
        <div className="relative h-full flex flex-col items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-tennis-line mb-4 drop-shadow-lg">
              開催場所一覧
            </h1>
            <p className="text-xl text-tennis-line/90 drop-shadow-md max-w-2xl mx-auto">
              Joy'n Tennisの活動拠点をご紹介します。
              予約状況に応じて、これらの会場で活動を行っています。
            </p>
          </div>
        </div>
      </div>

      <LocationsClient />
    </main>
  );
}
