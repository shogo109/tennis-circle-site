"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/UserAvatar";
import UserForm from "@/components/UserForm";

interface User {
  id: string;
  username: string;
  display_name: string;
  admin: boolean;
}

interface EditingUser extends User {
  isEdited: boolean;
  original: User;
}

interface Props {
  initialUsers: User[];
}

export default function UsersClient({ initialUsers }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState<EditingUser[]>(
    initialUsers.map((user) => ({
      ...user,
      isEdited: false,
      original: { ...user },
    }))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // セッションストレージからユーザー情報を取得
    const userInfoStr = sessionStorage.getItem("userInfo");
    if (!userInfoStr) {
      router.push("/");
      return;
    }

    // 管理者権限の確認
    try {
      const decodedData = atob(userInfoStr);
      const userInfo = JSON.parse(decodeURIComponent(decodedData));
      setIsAdmin(userInfo.admin);
      if (!userInfo.admin) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error parsing user info:", error);
      setIsAdmin(false);
      router.push("/");
    }
  }, [router]);

  const handleUserChange = (userId: string, field: keyof User, value: string | boolean) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              [field]: value,
              isEdited:
                JSON.stringify({ ...user, [field]: value }) !== JSON.stringify(user.original),
            }
          : user
      )
    );
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const editedUsers = users.filter((user) => user.isEdited);

      if (editedUsers.length === 0) {
        return;
      }

      const userInfoStr = sessionStorage.getItem("userInfo");
      if (!userInfoStr) {
        throw new Error("認証情報が見つかりません");
      }

      // 更新処理
      const updatePromises = editedUsers.map((user) =>
        fetch("/api/users/batch-update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-user": userInfoStr,
          },
          body: JSON.stringify({
            id: user.id,
            username: user.username,
            display_name: user.display_name,
            admin: user.admin,
          }),
        })
      );

      const results = await Promise.all(updatePromises);
      const hasError = results.some((res) => !res.ok);

      if (hasError) {
        throw new Error("一部のユーザー情報の更新に失敗しました");
      }

      // 更新成功後、ユーザー一覧を再取得
      await fetchUsers();
      setIsEditMode(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "更新中にエラーが発生しました");
    } finally {
      setIsSaving(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/users", {
        headers: {
          "x-auth-user": sessionStorage.getItem("userInfo") || "",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/");
          return;
        }
        if (response.status === 403) {
          setError("このページにアクセスする権限がありません");
          return;
        }
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      // 編集用のフィールドを追加
      const editableUsers = data.map((user: User) => ({
        ...user,
        isEdited: false,
        original: { ...user },
      }));
      setUsers(editableUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("ユーザー情報の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tennis-court"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-red-500 text-lg">
          {error}
          <br />
          しばらく経ってから再度お試しください。
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* ユーザー一覧 */}
      <div className={isAdmin ? "lg:col-span-2" : "lg:col-span-3"}>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isAdmin && (
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-tennis-court"
                >
                  {isEditMode ? "編集モードを終了" : "編集モード"}
                </button>
                {isEditMode && (
                  <button
                    onClick={handleSaveChanges}
                    disabled={!users.some((user) => user.isEdited) || isSaving}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-tennis-court ${
                      users.some((user) => user.isEdited) && !isSaving
                        ? "bg-tennis-court hover:bg-tennis-court/90"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {isSaving ? "保存中..." : "変更を保存"}
                  </button>
                )}
              </div>
              {isEditMode && users.some((user) => user.isEdited) && (
                <span className="text-sm text-tennis-court">
                  {users.filter((user) => user.isEdited).length}件の変更があります
                </span>
              )}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5"
                  >
                    ユーザー
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5"
                  >
                    ユーザー名
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5"
                  >
                    権限
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-gray-50 ${user.isEdited ? "bg-tennis-court/5" : ""}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserAvatar
                          displayName={user.display_name || user.username}
                          size="sm"
                        />
                        {isEditMode ? (
                          <input
                            type="text"
                            value={user.display_name}
                            onChange={(e) =>
                              handleUserChange(user.id, "display_name", e.target.value)
                            }
                            className="ml-3 text-sm text-gray-900 border-b border-gray-300 focus:border-tennis-court focus:outline-none px-1"
                          />
                        ) : (
                          <span className="ml-3 text-sm text-gray-900">
                            {user.display_name || user.username}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={user.username}
                          onChange={(e) => handleUserChange(user.id, "username", e.target.value)}
                          className="text-sm text-gray-500 border-b border-gray-300 focus:border-tennis-court focus:outline-none px-1"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">{user.username}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditMode ? (
                        <select
                          value={user.admin ? "1" : "0"}
                          onChange={(e) =>
                            handleUserChange(user.id, "admin", e.target.value === "1")
                          }
                          className="w-32 px-3 py-2 text-base font-medium border-gray-300 rounded-md focus:border-tennis-court focus:ring-tennis-court"
                        >
                          <option
                            value="0"
                            className="text-lg"
                          >
                            一般
                          </option>
                          <option
                            value="1"
                            className="text-lg"
                          >
                            管理者
                          </option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.admin
                              ? "bg-tennis-court/10 text-tennis-court"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.admin ? "管理者" : "一般"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 登録フォーム（管理者のみ表示） */}
      {isAdmin && !isEditMode && (
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <UserForm onUserAdded={fetchUsers} />
          </div>
        </div>
      )}
    </div>
  );
}
