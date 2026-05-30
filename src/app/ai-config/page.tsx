'use client';

import { useState, useEffect } from 'react';
import { useAIConfig } from '@/hooks/use-ai-config';
import { AIConfig, AIProvider } from '@/types/ai';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Save, RotateCcw, Check, AlertCircle, Sparkles } from 'lucide-react';

const PROVIDER_INFO: Record<AIProvider, { name: string; icon: string; description: string }> = {
  openai: {
    name: 'OpenAI',
    icon: '🔮',
    description: 'GPT-4、GPT-3.5等模型'
  },
  qwen: {
    name: '通义千问',
    icon: '🚀',
    description: '阿里云通义千问大模型'
  },
  ernie: {
    name: '文心一言',
    icon: '🐉',
    description: '百度文心大模型'
  }
};

export default function AIConfigPage() {
  const { config, isLoaded, saveConfig, resetConfig, clearConfig, initConfig, defaultConfigs } = useAIConfig();
  const [formData, setFormData] = useState<AIConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isLoaded && config) {
      setFormData(config);
    }
  }, [isLoaded, config]);

  const handleProviderChange = (provider: AIProvider) => {
    const newConfig = config && config.provider === provider 
      ? config 
      : initConfig(provider);
    setFormData(newConfig);
  };

  const handleSave = async () => {
    if (!formData) return;
    
    setIsSaving(true);
    try {
      saveConfig(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (formData) {
      resetConfig(formData.provider);
    }
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Sparkles className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI 配置</h1>
            <p className="text-gray-600">选择一个AI提供商开始配置</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Object.keys(PROVIDER_INFO) as AIProvider[]).map((provider) => (
              <Card key={provider} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleProviderChange(provider)}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">{PROVIDER_INFO[provider].icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{PROVIDER_INFO[provider].name}</h3>
                    <p className="text-gray-600 text-sm">{PROVIDER_INFO[provider].description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">AI 配置</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>选择AI提供商</CardTitle>
            <CardDescription>配置您的AI服务密钥和端点</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {(Object.keys(PROVIDER_INFO) as AIProvider[]).map((provider) => (
                <button
                  key={provider}
                  onClick={() => handleProviderChange(provider)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.provider === provider
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{PROVIDER_INFO[provider].icon}</div>
                  <div className="font-medium">{PROVIDER_INFO[provider].name}</div>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入您的API Key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endpoint
                </label>
                <input
                  type="text"
                  value={formData.endpoint}
                  onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="API端点地址"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  模型
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="模型名称"
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">隐私说明</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    您的API密钥安全地存储在浏览器的localStorage中，不会上传到任何第三方服务器。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                重置
              </Button>
              <Button variant="outline" onClick={clearConfig}>
                清除配置
              </Button>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : saveSuccess ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saveSuccess ? '已保存' : '保存配置'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
