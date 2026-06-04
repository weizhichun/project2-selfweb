'use client';

import { useState } from 'react';
import { useAIConfig } from '@/hooks/use-ai-config';
import AIService from '@/lib/ai-service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, Copy, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NoteAssistantPage() {
  const { config } = useAIConfig();
  const [rawContent, setRawContent] = useState('');
  const [format, setFormat] = useState<'outline' | 'markdown' | 'summary'>('markdown');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!config || !rawContent.trim()) return;

    setIsLoading(true);
    try {
      const aiService = new AIService(config);
      const response = await aiService.noteAssistant({
        rawContent,
        format
      });
      setResult(response);
    } catch (error) {
      console.error('生成笔记失败:', error);
      alert('生成失败，请检查配置后重试');
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
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">请先配置AI</h2>
          <p className="text-gray-600 mb-4">需要配置AI服务才能使用笔记助手</p>
          <Link href="/ai-config">
            <Button>前往配置</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/ai-tools">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
          </Link>
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">AI 笔记助手</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>输入内容</CardTitle>
              <CardDescription>粘贴您的零散内容，AI将帮您整理</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                {[
                  { value: 'outline', label: '大纲' },
                  { value: 'markdown', label: 'Markdown' },
                  { value: 'summary', label: '摘要' }
                ].map((f) => (
                  <Button
                    key={f.value}
                    variant={format === f.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormat(f.value as 'outline' | 'markdown' | 'summary')}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
              <textarea
                dir="ltr"
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                className="w-full h-96 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="在这里输入您的零散内容..."
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerate} disabled={isLoading || !rawContent.trim()} className="w-full">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isLoading ? '整理中...' : '整理笔记'}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>整理结果</CardTitle>
                <CardDescription>AI为您整理好的笔记</CardDescription>
              </div>
              {result && (
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="w-full h-96 p-4 border border-gray-300 rounded-md bg-gray-50 overflow-auto whitespace-pre-wrap">
                {result || '整理结果将显示在这里...'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
