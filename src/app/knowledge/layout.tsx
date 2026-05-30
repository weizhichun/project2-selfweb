import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "知识库",
  description: "魏智纯的个人知识库，整理和分享技术笔记、学习资料和经验总结。",
  openGraph: {
    title: "知识库 | 魏智纯",
    description: "魏智纯的个人知识库，整理和分享技术笔记、学习资料和经验总结。",
  },
};

export default function KnowledgeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
