import Image from "next/image";
import AttendanceClient from "./client";

export default function AttendancePage() {
  return (
    <main className="min-h-screen">
      {/* ヒーローセクション */}
      <div className="relative h-[40vh] min-h-[300px]">
        {/* 背景画像 */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2940"
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
              出欠確認
            </h1>
            <p className="text-xl text-tennis-line/90 drop-shadow-md max-w-2xl mx-auto">
              イベントの出欠状況を確認・登録できます。 参加予定の方は必ず出欠の登録をお願いします。
            </p>
          </div>
        </div>
      </div>

      {/* 出欠セクション */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <AttendanceClient />
          </div>
        </div>
      </section>
    </main>
  );
}
