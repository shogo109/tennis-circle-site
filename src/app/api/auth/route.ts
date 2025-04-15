import { NextResponse } from "next/server";
import { getUser } from "@/lib/notion/users";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // パスワードの検証
    if (password !== "2015") {
      return NextResponse.json({ error: "パスワードが正しくありません" }, { status: 401 });
    }

    // Notionデータベースでユーザーを検索
    const user = await getUser(username);
    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    return NextResponse.json({
      username: user.name,
      userId: user.id,
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json({ error: "認証中にエラーが発生しました" }, { status: 500 });
  }
}
