"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/use-profile";
import { Download, GraduationCap, Briefcase, Code, BookOpen } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useRef } from "react";

export default function ResumePage() {
  const { profile, isLoading } = useProfile();
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!resumeRef.current || !profile) return;

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${profile.name}-简历.pdf`);
    } catch (error) {
      console.error("导出PDF失败:", error);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">个人简历</h1>
        <Button onClick={handleExportPDF}>
          <Download className="mr-2 h-4 w-4" />
          导出PDF
        </Button>
      </div>

      <div ref={resumeRef} className="bg-white dark:bg-background">
        <div className="max-w-4xl mx-auto">
          <header className="text-center py-8 border-b">
            <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
            <p className="text-xl text-muted-foreground mb-4">{profile.title}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span>{profile.email}</span>
              <span>•</span>
              <span>{profile.phone}</span>
              <span>•</span>
              <a href={profile.github} className="text-primary hover:underline">
                Gitee
              </a>
            </div>
          </header>

          <section className="py-5 border-b" style={{ lineHeight: "1.65" }}>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <GraduationCap className="mr-2 h-4 w-4" />
              教育经历
            </h2>
            {profile.education
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h3 className="font-semibold text-base">{edu.school}</h3>
                      <p className="text-muted-foreground text-sm">
                        {edu.degree} · {edu.major}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{edu.period}</span>
                  </div>
                  {edu.description && (
                    <p className="mt-2 text-xs">{edu.description}</p>
                  )}
                </div>
              ))}
          </section>

          <section className="py-5 border-b" style={{ lineHeight: "1.65" }}>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <Briefcase className="mr-2 h-4 w-4" />
              工作/实习经历
            </h2>
            {profile.experience
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((exp) => (
                <div key={exp.id} className="mb-5">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h3 className="font-semibold text-base">{exp.company}</h3>
                      <p className="text-muted-foreground text-sm">{exp.position}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{exp.period}</span>
                  </div>
                  <ul className="mt-2 space-y-1.5 text-xs">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex">
                        <span className="mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-primary">成果数据：</p>
                      <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex">
                            <span className="mr-2">✓</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
          </section>

          <section className="py-5 border-b" style={{ lineHeight: "1.65" }}>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <Code className="mr-2 h-4 w-4" />
              项目经历
            </h2>
            {profile.projects
              .filter((p) => p.isPublic)
              .map((project) => (
                <div key={project.id} className="mb-5">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <h3 className="font-semibold text-base">{project.title}</h3>
                    <span className="text-xs text-muted-foreground">{project.period}</span>
                  </div>
                  <p className="mt-2 text-xs">{project.description}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {project.details && (
                    <p className="mt-2 text-xs text-muted-foreground">{project.details}</p>
                  )}
                </div>
              ))}
          </section>

          <section className="py-5" style={{ lineHeight: "1.65" }}>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <BookOpen className="mr-2 h-4 w-4" />
              专业技能
            </h2>
            <div className="space-y-5">
              {profile.skillCategories.map((category) => (
                <div key={category.id} className="border rounded-lg p-5">
                  <h3 className="font-semibold text-base mb-2">{category.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2.5">{category.description}</p>
                  {category.highlights && (
                    <ul className="list-disc list-inside text-xs space-y-1 mb-2.5">
                      {category.highlights.map((highlight, idx) => (
                        <li key={idx}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {category.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
