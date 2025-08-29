"use client";

import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

export const TopBar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Назад
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Worship Management - Панель администратора
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Добро пожаловать, {session.user?.name} ({session.user?.role})
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
