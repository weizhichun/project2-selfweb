'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, FileText, Database, Briefcase, UserCheck, Settings } from 'lucide-react';
import { useAIConfig } from '@/hooks/use-ai-config';

const tools = [
  {
    title: '笔记助手',
    description: '将零散内容整理成结构化笔记',
    icon: FileText,
    href: '/ai-tools/note-assistant',
    color: 'text-blue-600'
  },
  {
    title: '知识库问答',
    description: '基于本地笔记回答问题',
    icon: Database,
    href: '/ai-tools/knowledge-qa',
    color: 'text-green-600'
  },
  {
    title: '简历优化',
    description: '针对目标岗位优化简历',
    icon: Briefcase,
    href: '/ai-tools/resume-optimizer',
    color: 'text-purple-600'
  },
  {
    title: '面试模拟',
    description: '生成面试问题并提供反馈',
    icon: UserCheck,
    href: '/ai-tools/interview-mock',
    color: 'text-orange-600'
  }
];

export default function AIToolsPage() {
  const { config, isLoaded } = useAIConfig();

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Sparkles className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI 增强工具集</h1>
          <p className="text-lg text-gray-600">
            使用AI提升您的工作效率
          </p>
        </div>

        {!isLoaded ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : !config ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">请先配置AI</h3>
                <p className="text-gray-600 mb-4">需要配置AI服务才能使用这些工具</p>
                <Link href="/ai-config">
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    <Settings className="h-4 w-4 mr-2" />
                    前往配置
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <tool.icon className={`h-10 w-10 ${tool.color} flex-shrink-0`} />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.title}</h3>
                        <p className="text-gray-600">{tool.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
