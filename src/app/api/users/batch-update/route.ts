import { NextRequest, NextResponse } from "next/server";
import { updateUser } from "@/lib/notion/users";

export async function PUT(request: NextRequest) {
  try {
    const userInfoStr = request.headers.get("x-auth-user");
    if (!userInfoStr) {
      return NextResponse.json({ error: "認証情報が見つかりません" }, { status: 401 });
    }

    // ユーザー情報をデコード
    const decodedData = atob(userInfoStr);
    const userInfo = JSON.parse(decodeURIComponent(decodedData));

    if (!userInfo.admin) {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
    }

    const { id, username, display_name, admin } = await request.json();

    if (!id || !username) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }

    const result = await updateUser({
      id,
      username,
      display_name,
      admin,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "ユーザー情報の更新に失敗しました" }, { status: 500 });
  }
}
