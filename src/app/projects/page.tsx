"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";
import { Project } from "@/types";
import {
  Github,
  ExternalLink,
  Eye,
  EyeOff,
  ChevronLeft,
  Plus,
  FolderOpen,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ProjectsPage() {
  const { profile, isLoading } = useProfile();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  const projects = profile?.projects || [];
  const displayedProjects = showAll
    ? projects
    : projects.filter((p) => p.isPublic);

  if (selectedProject) {
    return (
      <div className="container py-12">
        <Button
          variant="outline"
          onClick={() => setSelectedProject(null)}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          返回项目列表
        </Button>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">{selectedProject.title}</CardTitle>
                <p className="text-muted-foreground mt-1">{selectedProject.period}</p>
              </div>
              {!selectedProject.isPublic && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <EyeOff className="h-3 w-3" />
                  私密
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">{selectedProject.description}</p>
            {selectedProject.details && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <h3 className="font-semibold mb-2">项目详情</h3>
                <p>{selectedProject.details}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold mb-3">技术栈</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4"
                >
                  <Github className="mr-2 h-4 w-4" />
                  查看源码
                </a>
              )}
              {selectedProject.demoUrl && (
                <a
                  href={selectedProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  在线演示
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">项目展示</h1>
          <p className="text-muted-foreground mt-1">
            共 {projects.length} 个项目
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAll(!showAll)}>
            {showAll ? (
              <>
                <Eye className="mr-2 h-4 w-4" />
                只看公开
              </>
            ) : (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                显示全部
              </>
            )}
          </Button>
          <Link href="/settings/projects">
            <Button>
              <FolderOpen className="mr-2 h-4 w-4" />
              管理项目
            </Button>
          </Link>
        </div>
      </div>

      {displayedProjects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {projects.length === 0 ? "暂无项目" : "暂无公开项目"}
            </p>
            <Link href="/settings/projects">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                添加项目
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedProject(project)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  {!project.isPublic && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <EyeOff className="h-3 w-3" />
                      私密
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{project.period}</p>
              </CardHeader>
              <CardContent>
                <p className="mb-4 line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  {project.githubUrl && (
                    <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-1" />
                        源码
                      </a>
                    </Button>
                  )}
                  {project.demoUrl && (
                    <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        演示
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
