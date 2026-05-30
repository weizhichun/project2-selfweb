import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "项目展示",
  description: "魏智纯的项目作品集，展示个人开发的各类项目，包括技术栈和项目详情。",
  openGraph: {
    title: "项目展示 | 魏智纯",
    description: "魏智纯的项目作品集，展示个人开发的各类项目，包括技术栈和项目详情。",
  },
};

export default function ProjectsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
