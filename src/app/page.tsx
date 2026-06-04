"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { AvatarUploader } from "@/components/AvatarUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";
import {
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Briefcase,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/hooks/use-theme";


// 动态导入图表组件，避免阻塞首屏加载
const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="h-80 flex items-center justify-center">
      <div className="text-muted-foreground">加载中...</div>
    </div>
  ),
});

interface RadarChartProps {
  radarSkills: string[];
  radarValues: number[];
}

function RadarChart({ radarSkills, radarValues }: RadarChartProps) {
  const { theme } = useTheme();

  const radarOption = {
    tooltip: {},
    radar: {
      indicator: radarSkills.map((skill) => ({
        name: skill,
        max: 100,
      })),
      axisName: {
        color: theme === "dark" ? "#e5e7eb" : "#374151",
        fontSize: 14,
      },
      splitArea: {
        areaStyle: {
          color: theme === "dark" 
            ? ["rgba(55, 65, 81, 0.1)", "rgba(55, 65, 81, 0.2)"] 
            : ["rgba(229, 231, 235, 0.1)", "rgba(229, 231, 235, 0.2)"],
        },
      },
    },
    series: [
      {
        name: "能力雷达",
        type: "radar",
        data: [
          {
            value: radarValues,
            name: "能力值",
            areaStyle: {
              color: theme === "dark" 
                ? "rgba(96, 165, 250, 0.3)" 
                : "rgba(59, 130, 246, 0.3)",
            },
            lineStyle: {
              color: theme === "dark" ? "#60a5fa" : "#3b82f6",
            },
            itemStyle: {
              color: theme === "dark" ? "#60a5fa" : "#3b82f6",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="h-80">
      <ReactECharts
        option={radarOption}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}

export default function Home() {
  const { profile, isLoading } = useProfile();

  if (isLoading || !profile) {
    return (
      <div className="max-w-[1200px] mx-auto py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    alert("邮箱已复制到剪贴板");
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(profile.phone);
    alert("电话已复制到剪贴板");
  };

  return (
    <div className="max-w-[1200px] mx-auto py-10">
      {/* 首页顶部个人信息区 */}
      <section className="mb-7">
        <div className="flex flex-col md:flex-row items-center gap-7">
          <AvatarUploader size="xl" />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
            <p className="text-lg text-muted-foreground mb-5">
              {profile.title}
            </p>
            
            {/* 个人优势 */}
            <div className="text-left mb-5 leading-relaxed" style={{ lineHeight: "1.65" }}>
              <h3 className="font-semibold text-base mb-2.5">个人优势</h3>
              <ul className="list-disc list-inside space-y-1.5 text-muted-foreground text-sm">
                <li>双向理解能力：既懂大模型的基础技术原理，能理解产品的技术边界，又懂内容传播逻辑，能从 C 端用户的角度给产品提优化建议，是技术和内容团队之间的天然桥梁</li>
                <li>落地能力强：会用 Python 和大模型工具，能帮团队完成 Prompt 优化、RAG 应用测试、批量内容处理、效果数据复盘等工作，直接提升团队的工作效率</li>
                <li>交叉视野：能从传播的角度思考 AIGC 内容的合规性、用户接受度，避免纯技术团队做产品时忽略的内容风险和传播问题</li>
              </ul>
            </div>
            
            {/* 按钮区域 */}
            <div className="flex justify-center md:justify-start gap-4">
              <Link href="/resume">
                <Button className="px-5">
                  <FileText className="mr-2 h-4 w-4" />
                  查看简历
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" className="px-5">
                  <Briefcase className="mr-2 h-4 w-4" />
                  查看项目
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 快速联系区 */}
      <section className="mb-7">
        <Card>
          <CardHeader>
            <CardTitle>快速联系</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-2.5 p-5 rounded-lg border hover:bg-accent transition-colors text-left w-full hover:shadow-md transition-shadow"
              >
                <Mail className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">邮箱</p>
                  <p className="font-medium text-sm">{profile.email}</p>
                </div>
              </button>
              <button
                onClick={handleCopyPhone}
                className="flex items-center gap-2.5 p-5 rounded-lg border hover:bg-accent transition-colors text-left w-full hover:shadow-md transition-shadow"
              >
                <Phone className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">电话</p>
                  <p className="font-medium text-sm">{profile.phone}</p>
                </div>
              </button>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-5 rounded-lg border hover:bg-accent transition-colors hover:shadow-md transition-shadow"
              >
                <Instagram className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">小红书</p>
                  <p className="font-medium text-sm">我的教育运营账号</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
              <Link
                href="/projects"
                className="flex items-center gap-2.5 p-5 rounded-lg border hover:bg-accent transition-colors hover:shadow-md transition-shadow"
              >
                <Briefcase className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">项目作品集</p>
                  <p className="font-medium text-sm">查看我的项目</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 技能标签区和雷达图 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mb-7">
        <Card>
          <CardHeader>
            <CardTitle>技能标签</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {(profile.skillCategories || []).map((category) => (
                <div key={category.id} className="p-5 border rounded-lg">
                  <h3 className="text-base font-bold mb-2">
                    {category.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2.5 leading-relaxed" style={{ lineHeight: "1.65" }}>
                    {category.description}
                  </p>
                  {/* 亮点描述 */}
                  {category.highlights && category.highlights.length > 0 && (
                    <div className="mb-3 p-2.5 bg-accent/50 rounded-lg">
                      {category.highlights.map((highlight, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground leading-relaxed" style={{ lineHeight: "1.65" }}>
                          {highlight}
                        </p>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {(category.tags || []).map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1.5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>能力雷达图</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={
              <div className="h-80 flex items-center justify-center">
                <div className="text-muted-foreground">加载中...</div>
              </div>
            }>
              <RadarChart 
                radarSkills={profile.radarSkills} 
                radarValues={profile.radarValues} 
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* 精选项目 */}
      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>精选项目</CardTitle>
            <Link href="/projects">
              <Button variant="outline" size="sm">
                查看全部
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(profile.projects || [])
                .filter((p) => p.isPublic)
                .slice(0, 2)
                .map((project) => (
                  <Card key={project.id} className="border">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{project.title}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {project.period}
                      </p>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs mb-2.5">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(project.tags || []).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
