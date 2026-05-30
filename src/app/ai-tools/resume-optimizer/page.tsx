'use client';

import { useState } from 'react';
import { useAIConfig } from '@/hooks/use-ai-config';
import AIService from '@/lib/ai-service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Sparkles, Copy, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ResumeOptimizerPage() {
  const { config } = useAIConfig();
  const [currentResume, setCurrentResume] = useState('');
  const [targetPosition, setTargetPosition] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOptimize = async () => {
    if (!config || !currentResume.trim() || !targetPosition.trim()) return;

    setIsLoading(true);
    try {
      const aiService = new AIService(config);
      const response = await aiService.resumeOptimize({
        currentResume,
        targetPosition,
        jobDescription
      });
      setResult(response);
    } catch (error) {
      console.error('优化简历失败:', error);
      alert('优化失败，请检查配置后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!config) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto text-center py-12">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">请先配置AI</h2>
          <p className="text-gray-600 mb-4">需要配置AI服务才能使用简历优化</p>
          <Link href="/ai-config">
            <Button>前往配置</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/ai-tools">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
          </Link>
          <Briefcase className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">简历优化助手</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>输入信息</CardTitle>
              <CardDescription>提供您的简历和目标岗位信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目标岗位
                </label>
                <input
                  type="text"
                  value={targetPosition}
                  onChange={(e) => setTargetPosition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="例如：高级前端工程师"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  职位描述（可选）
                </label>
                <textarea
                  dir="ltr"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="粘贴职位描述..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  当前简历
                </label>
                <textarea
                  dir="ltr"
                  value={currentResume}
                  onChange={(e) => setCurrentResume(e.target.value)}
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="粘贴您的简历内容..."
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleOptimize} 
                disabled={isLoading || !currentResume.trim() || !targetPosition.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isLoading ? '优化中...' : '优化简历'}
              </Button>
            </CardFooter>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>优化结果</CardTitle>
                <CardDescription>AI为您优化后的简历</CardDescription>
              </div>
              {result && (
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="w-full h-[calc(100vh-16rem)] p-4 border border-gray-300 rounded-md bg-gray-50 overflow-auto whitespace-pre-wrap">
                {result || '优化结果将显示在这里...'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
