"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthGuard from "../lib/auth-guard";

const adminNavigation = [
  { name: "대시보드", href: "/admin" },
  { name: "배너 관리", href: "/admin/banners" },
  { name: "전시 관리", href: "/admin/exhibitions" },
  { name: "뉴스 관리", href: "/admin/news" },
  { name: "갤러리 정보", href: "/admin/gallery-info" },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link
                href="/admin"
                className="text-xl font-light tracking-wider text-gray-900"
              >
                SPACE 458 관리자
              </Link>
              <nav className="hidden md:flex space-x-6">
                {adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-light transition-colors ${
                      pathname === item.href
                        ? "text-gray-900 border-b-2 border-gray-900 pb-1"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 font-light">
                {session?.user?.name}
              </span>
              <button
                onClick={handleSignOut}
                className="cursor-pointer text-sm text-gray-600 hover:text-gray-900 font-light transition-colors"
              >
                로그아웃
              </button>
              <Link
                href="/"
                target="_blank"
                className="text-sm text-gray-600 hover:text-gray-900 font-light transition-colors"
              >
                사이트 보기
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthGuard>
  );
}
