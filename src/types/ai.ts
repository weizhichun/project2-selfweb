export type AIProvider = 'openai' | 'qwen' | 'ernie';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  endpoint: string;
  model: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface NoteAssistantRequest {
  rawContent: string;
  format?: 'outline' | 'markdown' | 'summary';
}

export interface ResumeOptimizeRequest {
  currentResume: string;
  targetPosition: string;
  jobDescription: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswer?: string;
}

export interface InterviewFeedback {
  question: string;
  userAnswer: string;
  score: number;
  feedback: string;
  improvement: string;
}
