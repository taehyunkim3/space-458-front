import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import SessionProvider from "../providers/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "관리자 로그인 | Space 458",
  description: "Space 458 관리자 로그인 페이지",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}