import { useState, useEffect } from 'react';
import { AIConfig, AIProvider } from '@/types/ai';

const AI_CONFIG_KEY = 'ai-config';

const DEFAULT_CONFIG: Record<AIProvider, Omit<AIConfig, 'apiKey'>> = {
  openai: {
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o'
  },
  qwen: {
    provider: 'qwen',
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    model: 'qwen-max'
  },
  ernie: {
    provider: 'ernie',
    endpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
    model: 'ernie-4.0-8k'
  }
};

export function useAIConfig() {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(AI_CONFIG_KEY);
      if (saved) {
        setConfig(JSON.parse(saved));
      }
      setIsLoaded(true);
    }
  };

  const saveConfig = (newConfig: AIConfig) => {
    setConfig(newConfig);
    if (typeof window !== 'undefined') {
      localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(newConfig));
    }
  };

  const resetConfig = (provider: AIProvider) => {
    const defaultConfig = {
      ...DEFAULT_CONFIG[provider],
      apiKey: ''
    };
    saveConfig(defaultConfig);
  };

  const clearConfig = () => {
    setConfig(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AI_CONFIG_KEY);
    }
  };

  const initConfig = (provider: AIProvider) => {
    const defaultConfig = {
      ...DEFAULT_CONFIG[provider],
      apiKey: ''
    };
    saveConfig(defaultConfig);
    return defaultConfig;
  };

  return {
    config,
    isLoaded,
    saveConfig,
    resetConfig,
    clearConfig,
    initConfig,
    defaultConfigs: DEFAULT_CONFIG
  };
}
