'use client';

import { useState } from 'react';
import { useAIConfig } from '@/hooks/use-ai-config';
import AIService from '@/lib/ai-service';
import { InterviewQuestion, InterviewFeedback } from '@/types/ai';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, Sparkles, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function InterviewMockPage() {
  const { config } = useAIConfig();
  const [targetPosition, setTargetPosition] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleGenerateQuestions = async () => {
    if (!config || !targetPosition.trim()) return;

    setIsGenerating(true);
    try {
      const aiService = new AIService(config);
      const generatedQuestions = await aiService.generateInterviewQuestions(
        targetPosition,
        jobDescription,
        5
      );
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setFeedback(null);
      setShowAnswer(false);
    } catch (error) {
      console.error('生成面试问题失败:', error);
      alert('生成失败，请检查配置后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!config || !userAnswer.trim() || !questions[currentQuestionIndex]) return;

    setIsEvaluating(true);
    try {
      const aiService = new AIService(config);
      const question = questions[currentQuestionIndex];
      const evaluation = await aiService.evaluateInterviewAnswer(
        question.question,
        userAnswer,
        question.expectedAnswer
      );
      setFeedback(evaluation);
      setShowAnswer(true);
    } catch (error) {
      console.error('评估回答失败:', error);
      alert('评估失败，请重试');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setFeedback(null);
      setShowAnswer(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setUserAnswer('');
      setFeedback(null);
      setShowAnswer(false);
    }
  };

  if (!config) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto text-center py-12">
          <UserCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">请先配置AI</h2>
          <p className="text-gray-600 mb-4">需要配置AI服务才能使用面试模拟</p>
          <Link href="/ai-config">
            <Button>前往配置</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

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
          <UserCheck className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">面试模拟</h1>
        </div>

        {questions.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>生成面试问题</CardTitle>
              <CardDescription>输入目标岗位信息，AI将为您生成面试问题</CardDescription>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  placeholder="粘贴职位描述..."
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerateQuestions} 
                disabled={isGenerating || !targetPosition.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? '生成中...' : '生成面试问题'}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                问题 {currentQuestionIndex + 1} / {questions.length}
              </div>
              <div className="flex gap-2">
                {currentQuestion.category && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {currentQuestion.category}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentQuestion.difficulty === 'easy' ? '简单' :
                   currentQuestion.difficulty === 'medium' ? '中等' : '困难'}
                </span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showAnswer ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      您的回答
                    </label>
                    <textarea
                      dir="ltr"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      placeholder="在这里输入您的回答..."
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">您的回答：</div>
                      <p className="text-gray-900">{userAnswer}</p>
                    </div>

                    {feedback && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                            feedback.score >= 8 ? 'bg-green-100' :
                            feedback.score >= 5 ? 'bg-yellow-100' :
                            'bg-red-100'
                          }`}>
                            {feedback.score}
                          </div>
                          <div>
                            <div className="font-medium">评分</div>
                            <div className="text-sm text-gray-600">满分10分</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-1">反馈：</div>
                            <p className="text-gray-900">{feedback.feedback}</p>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-1">改进建议：</div>
                            <p className="text-gray-900">{feedback.improvement}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentQuestion.expectedAnswer && (
                      <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <div className="text-sm font-medium text-green-800">参考答案要点</div>
                        </div>
                        <p className="text-green-900">{currentQuestion.expectedAnswer}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {!showAnswer ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handlePrevQuestion} 
                      disabled={currentQuestionIndex === 0}
                    >
                      上一题
                    </Button>
                    <Button 
                      onClick={handleSubmitAnswer} 
                      disabled={isEvaluating || !userAnswer.trim()}
                    >
                      {isEvaluating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : null}
                      提交回答
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowAnswer(false);
                        setFeedback(null);
                      }}
                    >
                      修改回答
                    </Button>
                    {currentQuestionIndex < questions.length - 1 && (
                      <Button onClick={handleNextQuestion}>
                        下一题
                      </Button>
                    )}
                  </div>
                )}
              </CardFooter>
            </Card>

            <div className="flex gap-2 justify-center">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentQuestionIndex(index);
                    setUserAnswer('');
                    setFeedback(null);
                    setShowAnswer(false);
                  }}
                  className={`w-3 h-3 rounded-full ${
                    index === currentQuestionIndex ? 'bg-orange-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
