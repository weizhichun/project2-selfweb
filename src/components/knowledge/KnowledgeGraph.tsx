'use client';

import ReactECharts from 'echarts-for-react';
import { Note, Category, NoteRelation } from '@/types/knowledge';
import { Card } from '@/components/ui/card';

interface KnowledgeGraphProps {
  notes: Note[];
  categories: Category[];
  relations: NoteRelation[];
}

export function KnowledgeGraph({ notes, categories, relations }: KnowledgeGraphProps) {
  const getCategory = (id: string) => categories.find(cat => cat.id === id);
  
  const getNoteCategoryId = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    return note?.categoryId || '';
  };

  const isCrossDomain = (relation: NoteRelation) => {
    const sourceCategory = getNoteCategoryId(relation.sourceNoteId);
    const targetCategory = getNoteCategoryId(relation.targetNoteId);
    return sourceCategory !== targetCategory;
  };

  const hasCrossDomain = relations.some(rel => isCrossDomain(rel));

  const option = {
    tooltip: {
      formatter: (params: any) => {
        if (params.dataType === 'node') {
          const note = notes.find(n => n.id === params.data.id);
          return `<strong>${params.data.name}</strong><br/>分类: ${getCategory(note?.categoryId || '')?.name || '未知'}`;
        } else if (params.dataType === 'edge') {
          const rel = relations.find(r => 
            r.sourceNoteId === params.data.source && 
            r.targetNoteId === params.data.target
          );
          if (!rel) return '';
          const sourceNote = notes.find(n => n.id === params.data.source);
          const targetNote = notes.find(n => n.id === params.data.target);
          const isCross = isCrossDomain(rel);
          return `<strong>${sourceNote?.title || '未知'}</strong> -> <strong>${targetNote?.title || '未知'}</strong><br/>
            ${isCross ? '<span style="color: #8b5cf6;">跨领域关联</span>' : '同领域关联'}<br/>
            ${rel.description || ''}`;
        }
        return params.data.name;
      },
    },
    ...(relations.length > 0 && hasCrossDomain ? {
      legend: {
        data: ['同领域关联', '跨领域关联'],
        orient: 'horizontal',
        bottom: 10,
        textStyle: {
          fontSize: 12,
        },
      },
    } : {}),
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: notes.map((note) => {
          const category = getCategory(note.categoryId);
          return {
            id: note.id,
            name: note.title,
            symbolSize: 35,
            itemStyle: {
              color: category?.color || '#666',
              borderWidth: 2,
              borderColor: '#fff',
            },
          };
        }),
        links: relations.map((rel) => {
          const isCross = isCrossDomain(rel);
          return {
            source: rel.sourceNoteId,
            target: rel.targetNoteId,
            name: isCross ? '跨领域关联' : '同领域关联',
            lineStyle: {
              color: isCross ? '#8b5cf6' : '#94a3b8',
              curveness: 0.3,
              width: isCross ? 3 : 2,
              opacity: isCross ? 0.8 : 0.5,
            },
          };
        }),
        roam: true,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
          fontSize: 12,
        },
        lineStyle: {
          curveness: 0.3,
        },
        force: {
          repulsion: 250,
          edgeLength: 180,
          gravity: 0.1,
        },
      },
    ],
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">知识图谱</h3>
      {notes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>暂无笔记数据，图谱无法展示</p>
        </div>
      ) : (
        <ReactECharts option={option} style={{ height: '400px' }} />
      )}
    </Card>
  );
}
