import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/toast";
import { ProfileProvider } from "@/hooks/use-profile";
import { AuthProvider } from "@/hooks/use-auth";

export const metadata: Metadata = {
  metadataBase: new URL("https://weizhichun.dev"),
  title: {
    default: "魏智纯 - 个人求职展示中心",
    template: "%s | 魏智纯",
  },
  description: "魏智纯的个人求职展示网站，包含简历、项目展示、知识库等内容。计算机科学与技术专业，2027届本科，寻找实习机会。",
  keywords: ["魏智纯", "个人网站", "求职", "简历", "计算机", "前端", "后端", "全栈"],
  authors: [{ name: "魏智纯" }],
  creator: "魏智纯",
  publisher: "魏智纯",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://weizhichun.dev",
    siteName: "魏智纯 - 个人求职展示中心",
    title: "魏智纯 - 个人求职展示中心",
    description: "魏智纯的个人求职展示网站，包含简历、项目展示、知识库等内容。",
    images: [
      {
        url: "https://api.dicebear.com/7.x/avataaars/svg?seed=weizhichun",
        width: 800,
        height: 800,
        alt: "魏智纯头像",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "魏智纯 - 个人求职展示中心",
    description: "魏智纯的个人求职展示网站，包含简历、项目展示、知识库等内容。",
    images: ["https://api.dicebear.com/7.x/avataaars/svg?seed=weizhichun"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "",
    yandex: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" dir="ltr" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ToastProvider>
          <AuthProvider>
            <ProfileProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </ProfileProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
