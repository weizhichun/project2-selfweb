export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  tags: string[];
  highlights?: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  period: string;
  description?: string;
  sortOrder: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string[];
  achievements?: string[];
  sortOrder: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  isPublic: boolean;
  period: string;
  details?: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export interface Profile {
  // 基本信息
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  title: string; // 求职意向
  bio: string; // 一句话个人介绍
  
  // 联系方式
  email: string;
  phone: string;
  location: string; // 现居地
  
  // 社交链接
  github: string;
  linkedin?: string;
  blog?: string;
  
  // 头像
  avatar: string;
  
  // 技能
  skills: Skill[];
  skillCategories: SkillCategory[];
  radarSkills: string[];
  radarValues: number[];
  
  // 教育与经验
  education: Education[];
  experience: Experience[];
  projects: Project[];
  knowledge: KnowledgeItem[];
}
