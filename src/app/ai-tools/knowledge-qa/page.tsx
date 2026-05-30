'use client';

import { useState, useEffect } from 'react';
import { useAIConfig } from '@/hooks/use-ai-config';
import AIService from '@/lib/ai-service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Sparkles, ArrowLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Note } from '@/types/knowledge';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function KnowledgeQAPage() {
  const { config } = useAIConfig();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      await db.init();
      const allNotes = await db.getNotes();
      setNotes(allNotes);
    } catch (error) {
      console.error('加载笔记失败:', error);
    }
  };

  const toggleNote = (noteId: string) => {
    setSelectedNoteIds(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleAsk = async () => {
    if (!config || !question.trim() || selectedNoteIds.length === 0) return;

    setIsLoading(true);
    const userMessage: ChatMessage = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);

    try {
      const selectedNotes = notes.filter(note => selectedNoteIds.includes(note.id));
      const knowledgeContext = selectedNotes
        .map(note => `# ${note.title}\n\n${note.content}`)
        .join('\n\n---\n\n');

      const aiService = new AIService(config);
      const response = await aiService.knowledgeQA(question, knowledgeContext);
      
      const assistantMessage: ChatMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('问答失败:', error);
      const errorMessage: ChatMessage = { role: 'assistant', content: '抱歉，发生了错误，请检查配置后重试' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  };

  if (!config) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto text-center py-12">
          <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">请先配置AI</h2>
          <p className="text-gray-600 mb-4">需要配置AI服务才能使用知识库问答</p>
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
          <Database className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">知识库问答</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>选择笔记</CardTitle>
                <CardDescription>选择要查询的知识库内容</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto">
                {notes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    暂无笔记，请先在知识库中添加
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notes.map(note => (
                      <label key={note.id} className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={selectedNoteIds.includes(note.id)}
                          onChange={() => toggleNote(note.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{note.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{note.content}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-12rem)] flex flex-col">
              <CardHeader>
                <CardTitle>对话</CardTitle>
                <CardDescription>基于选中的笔记进行问答</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>选择笔记后开始提问</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-lg ${
                          msg.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 p-4 rounded-lg">
                          <div className="flex gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full flex gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                    placeholder="输入您的问题..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isLoading || selectedNoteIds.length === 0}
                  />
                  <Button onClick={handleAsk} disabled={isLoading || !question.trim() || selectedNoteIds.length === 0}>
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    提问
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
