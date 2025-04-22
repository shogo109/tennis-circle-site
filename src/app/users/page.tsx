import { Metadata } from "next";
import Image from "next/image";
import { getUsers } from "@/lib/notion/users";
import UsersClient from "./client";

export const metadata: Metadata = {
  title: "ユーザー一覧 - テニスサークル",
  description: "テニスサークルのユーザー一覧ページです。",
};

function PageHeader() {
  return (
    <div className="relative h-[30vh] min-h-[200px]">
      {/* 背景画像 */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1542144582-1ba00456b5e3?q=80&w=2940"
          alt="管理画面"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-tennis-court/90 to-primary-600/80" />
      </div>

      {/* コンテンツ */}
      <div className="relative h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-tennis-line mb-2 drop-shadow-lg">
            ユーザー一覧
          </h1>
          <p className="text-base md:text-lg text-tennis-line/90 drop-shadow-md">メンバー一覧</p>
        </div>
      </div>
    </div>
  );
}

export default async function UsersPage() {
  try {
    const users = await getUsers();

    return (
      <main className="min-h-screen">
        <PageHeader />
        <section className="py-8 bg-primary-50">
          <div className="max-w-[1400px] mx-auto px-2 md:px-4">
            <UsersClient initialUsers={users} />
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error in UsersPage:", error);
    return (
      <main className="min-h-screen">
        <PageHeader />
        <section className="py-8 bg-primary-50">
          <div className="max-w-[1400px] mx-auto px-2 md:px-4">
            <div className="text-center">
              <p className="text-red-500 text-lg">
                データの取得中にエラーが発生しました。
                <br />
                しばらく経ってから再度お試しください。
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }
}
