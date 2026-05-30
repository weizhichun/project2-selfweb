import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Code,
  MessageSquare,
  Image,
  FileText,
  Brain,
  Wand2,
  ExternalLink,
} from "lucide-react";

const tools = [
  {
    id: 1,
    title: "智能代码助手",
    description: "基于AI的代码生成、解释和优化工具",
    icon: Code,
    category: "开发工具",
    color: "text-blue-500",
  },
  {
    id: 2,
    title: "AI聊天机器人",
    description: "与AI进行自然语言对话，获取帮助和建议",
    icon: MessageSquare,
    category: "对话工具",
    color: "text-green-500",
  },
  {
    id: 3,
    title: "图像生成器",
    description: "使用AI生成创意图像和艺术作品",
    icon: Image,
    category: "创意工具",
    color: "text-purple-500",
  },
  {
    id: 4,
    title: "文档智能分析",
    description: "自动分析和总结文档内容",
    icon: FileText,
    category: "效率工具",
    color: "text-orange-500",
  },
  {
    id: 5,
    title: "智能思维导图",
    description: "AI驱动的思维导图生成和管理",
    icon: Brain,
    category: "思维工具",
    color: "text-pink-500",
  },
  {
    id: 6,
    title: "写作助手",
    description: "帮助提升写作质量，提供创意建议",
    icon: Wand2,
    category: "写作工具",
    color: "text-cyan-500",
  },
];

export default function ToolsPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          AI工具集
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          一系列强大的AI工具，助力提升工作效率和创造力
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card
              key={tool.id}
              className="hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <Icon className={`h-8 w-8 ${tool.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {tool.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{tool.description}</p>
                <Button className="w-full" variant="outline">
                  即将上线
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
