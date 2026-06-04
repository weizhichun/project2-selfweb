import {
  AIConfig,
  ChatMessage,
  ChatCompletionResponse,
  NoteAssistantRequest,
  ResumeOptimizeRequest,
  InterviewQuestion,
  InterviewFeedback
} from '@/types/ai';

class AIService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  private async buildRequest(messages: ChatMessage[], options?: { temperature?: number; maxTokens?: number }) {
    const { provider, endpoint, apiKey, model } = this.config;
    
    const requestBody: Record<string, unknown> = {
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2000
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (provider === 'openai') {
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else if (provider === 'qwen') {
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else if (provider === 'ernie') {
      requestBody = {
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      };
      const finalEndpoint = endpoint.includes('?') 
        ? endpoint 
        : `${endpoint}?access_token=${apiKey}`;
      return { url: finalEndpoint, headers, body: requestBody };
    }

    return { url: endpoint, headers, body: requestBody };
  }

  async chatCompletion(messages: ChatMessage[], options?: { temperature?: number; maxTokens?: number }): Promise<string> {
    const { url, headers, body } = await this.buildRequest(messages, options);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI请求失败: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (this.config.provider === 'openai' || this.config.provider === 'qwen') {
      const completionResponse = data as ChatCompletionResponse;
      return completionResponse.choices[0]?.message?.content || '';
    } else if (this.config.provider === 'ernie') {
      return data.result || '';
    }
    
    return '';
  }

  async noteAssistant(request: NoteAssistantRequest): Promise<string> {
    const systemPrompt = this.getNoteAssistantSystemPrompt(request.format || 'markdown');
    
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: request.rawContent }
    ];

    return this.chatCompletion(messages, { temperature: 0.3, maxTokens: 3000 });
  }

  private getNoteAssistantSystemPrompt(format: string): string {
    const prompts = {
      outline: `你是一个专业的笔记整理助手。请将用户提供的零散内容整理成清晰的大纲结构。
要求：
1. 使用层级标题（#、##、###）组织内容
2. 提取核心观点
3. 保持逻辑连贯
4. 用简洁的语言表达`,
      
      markdown: `你是一个专业的笔记整理助手。请将用户提供的零散内容整理成结构清晰的Markdown笔记。
要求：
1. 使用合适的Markdown格式（标题、列表、加粗等）
2. 保持内容完整性
3. 突出重点信息
4. 添加合适的分段和小标题
5. 保持语言通顺自然`,
      
      summary: `你是一个专业的笔记整理助手。请将用户提供的零散内容总结成简洁的摘要。
要求：
1. 提取核心要点
2. 用段落形式表达
3. 不遗漏重要信息
4. 字数控制在原文的30-50%`
    };
    
    return prompts[format as keyof typeof prompts] || prompts.markdown;
  }

  async knowledgeQA(question: string, knowledgeContext: string): Promise<string> {
    const systemPrompt = `你是一个专业的知识库问答助手。请基于用户提供的知识库内容回答问题。

要求：
1. 严格基于提供的知识库内容回答，不要编造信息
2. 如果知识库中没有相关内容，请明确告知
3. 回答要准确、清晰、有条理
4. 适当引用知识库中的内容

知识库内容：
${knowledgeContext}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ];

    return this.chatCompletion(messages, { temperature: 0.3, maxTokens: 2000 });
  }

  async resumeOptimize(request: ResumeOptimizeRequest): Promise<string> {
    const systemPrompt = `你是一个专业的简历优化专家。请根据目标岗位和职位描述优化用户的简历。

要求：
1. 分析目标岗位的核心需求
2. 突出与岗位匹配的技能和经验
3. 使用专业、简洁的语言
4. 量化工作成果（如可能）
5. 保持简历的真实性
6. 优化简历的结构和排版

目标岗位：${request.targetPosition}
职位描述：${request.jobDescription}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: request.currentResume }
    ];

    return this.chatCompletion(messages, { temperature: 0.5, maxTokens: 4000 });
  }

  async generateInterviewQuestions(
    targetPosition: string,
    jobDescription: string,
    count: number = 5
  ): Promise<InterviewQuestion[]> {
    const systemPrompt = `你是一个专业的面试官。请为目标岗位生成${count}个面试问题。

要求：
1. 覆盖技术能力、项目经验、软技能等方面
2. 问题难度分布合理（简单、中等、困难）
3. 与目标岗位高度相关
4. 每个问题注明类别和难度
5. 提供参考答案要点

请以JSON格式返回，格式如下：
[{
  "id": "1",
  "question": "问题内容",
  "category": "类别",
  "difficulty": "easy|medium|hard",
  "expectedAnswer": "参考答案要点"
}]

目标岗位：${targetPosition}
职位描述：${jobDescription}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt }
    ];

    const response = await this.chatCompletion(messages, { temperature: 0.7, maxTokens: 3000 });
    
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch {
      throw new Error('解析面试问题失败');
    }
  }

  async evaluateInterviewAnswer(
    question: string,
    userAnswer: string,
    expectedAnswer?: string
  ): Promise<InterviewFeedback> {
    const systemPrompt = `你是一个专业的面试官。请评估用户对面试问题的回答，并提供反馈。

要求：
1. 给出1-10分的评分
2. 提供具体的反馈意见
3. 指出改进方向
4. 如果有参考答案，请对比参考答案进行评估${expectedAnswer ? `\n参考答案：${expectedAnswer}` : ''}

请以JSON格式返回，格式如下：
{
  "question": "问题内容",
  "userAnswer": "用户回答",
  "score": 评分,
  "feedback": "反馈意见",
  "improvement": "改进建议"
}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `问题：${question}\n\n用户回答：${userAnswer}` }
    ];

    const response = await this.chatCompletion(messages, { temperature: 0.5, maxTokens: 1500 });
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch {
      throw new Error('解析面试反馈失败');
    }
  }
}

export default AIService;
