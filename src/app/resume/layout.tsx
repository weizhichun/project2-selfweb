import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "个人简历",
  description: "魏智纯的个人简历，包含教育经历、工作实习、项目经历和专业技能，支持 PDF 导出。",
  openGraph: {
    title: "个人简历 | 魏智纯",
    description: "魏智纯的个人简历，包含教育经历、工作实习、项目经历和专业技能。",
  },
};

export default function ResumeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
