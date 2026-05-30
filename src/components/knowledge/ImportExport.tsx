'use client';

import { useState, useRef } from 'react';
import { Note, Category, Tag, NoteRelation, KnowledgeExport } from '@/types/knowledge';
import { Button } from '@/components/ui/button';
import { Upload, Download, FileText, FileJson, FileText as FileMarkdown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ImportExportProps {
  notes: Note[];
  categories: Category[];
  tags: Tag[];
  relations: NoteRelation[];
  onExport: () => Promise<KnowledgeExport>;
  onImport: (data: KnowledgeExport) => Promise<void>;
}

export function ImportExport({ notes, categories, tags, relations, onExport, onImport }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExportJSON = async () => {
    const data = await onExport();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledge-base-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    let markdown = `# 知识库导出\n\n导出时间: ${new Date().toLocaleString()}\n\n`;

    categories.forEach((category) => {
      const categoryNotes = notes.filter(note => note.categoryId === category.id);
      if (categoryNotes.length === 0) return;

      markdown += `## ${category.name}\n\n`;

      categoryNotes.forEach((note) => {
        markdown += `### ${note.title}\n\n`;
        if (note.tags.length > 0) {
          markdown += `**标签:** ${note.tags.join(', ')}\n\n`;
        }
        markdown += `**状态:** ${note.learningStatus === 'completed' ? '已完成' : note.learningStatus === 'learning' ? '学习中' : '未开始'}\n\n`;
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = note.content;
        const text = tempDiv.textContent || tempDiv.innerText || '';
        markdown += `${text}\n\n`;
        markdown += '---\n\n';
      });
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledge-base-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    const contentDiv = document.createElement('div');
    contentDiv.style.padding = '40px';
    contentDiv.style.fontFamily = 'Arial, sans-serif';
    contentDiv.style.backgroundColor = 'white';

    let html = `<h1 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">知识库导出</h1>`;
    html += `<p style="color: #666;">导出时间: ${new Date().toLocaleString()}</p>`;

    categories.forEach((category) => {
      const categoryNotes = notes.filter(note => note.categoryId === category.id);
      if (categoryNotes.length === 0) return;

      html += `<h2 style="color: ${category.color}; margin-top: 30px;">${category.name}</h2>`;

      categoryNotes.forEach((note) => {
        html += `<div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 8px;">`;
        html += `<h3 style="margin-top: 0;">${note.title}</h3>`;
        if (note.tags.length > 0) {
          html += `<p><strong>标签:</strong> ${note.tags.join(', ')}</p>`;
        }
        html += `<p><strong>状态:</strong> ${note.learningStatus === 'completed' ? '已完成' : note.learningStatus === 'learning' ? '学习中' : '未开始'}</p>`;
        html += `<div style="margin-top: 10px;">${note.content}</div>`;
        html += `</div>`;
      });
    });

    contentDiv.innerHTML = html;
    document.body.appendChild(contentDiv);

    try {
      const canvas = await html2canvas(contentDiv, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`knowledge-base-${new Date().toISOString().split('T')[0]}.pdf`);
    } finally {
      document.body.removeChild(contentDiv);
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        await onImport(data);
        alert('导入成功！');
      } catch (error) {
        alert('导入失败，请检查文件格式');
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">数据导入/导出</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleExportJSON}
          className="w-full justify-start"
        >
          <FileJson className="w-4 h-4 mr-2" />
          导出 JSON
        </Button>
        <Button
          onClick={handleExportMarkdown}
          className="w-full justify-start"
        >
          <FileMarkdown className="w-4 h-4 mr-2" />
          导出 Markdown
        </Button>
        <Button
          onClick={handleExportPDF}
          className="w-full justify-start"
        >
          <FileText className="w-4 h-4 mr-2" />
          导出 PDF
        </Button>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="w-full justify-start"
            variant="secondary"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isImporting ? '导入中...' : '导入 JSON'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
