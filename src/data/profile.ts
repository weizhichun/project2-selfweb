import { Profile } from "@/types";

export const profileData: Profile = {
  name: "魏智纯",
  age: 21,
  gender: "female",
  title: "AIGC 内容运营 / 产品助理",
  bio: "",
  email: "xxxibkkotnim@petalmail.com",
  phone: "17681329502",
  location: "安徽芜湖",
  github: "https://gitee.com/weizhichun",
  linkedin: "",
  blog: "",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=weizhichun&backgroundColor=b6e3f4&accessories=prescription02&hairColor=2c1b18&clothingColor=3c4a54&skinColor=f9c9a8",
  skills: [],
  skillCategories: [
    {
      id: "computer-skills",
      title: "计算机专业技能",
      description: "具备扎实的计算机科班基础，熟练掌握主流编程语言与核心技术知识，精通软件测试全流程，能够独立完成需求分析、用例设计、缺陷跟踪与测试报告输出，具备标准的工程化开发与测试思维。",
      tags: ["C/C++", "Java", "Python", "数据库", "计算机网络", "Linux", "软件测试全流程"],
      highlights: ["科班基础扎实，多语言开发能力均衡，精通软件测试全流程，具备严谨的逻辑思维与问题定位能力。"]
    },
    {
      id: "project-practice",
      title: "项目与实战能力",
      description: "能够独立跟进项目全生命周期，擅长需求对接、计划制定、跨团队协作与版本迭代，具备丰富的测试实战经验与数据驱动复盘能力，能高效落地任务并持续优化成果。",
      tags: ["全流程项目管理", "用例设计", "缺陷跟踪", "数据驱动复盘"],
      highlights: ["实战经验丰富，累计设计测试用例120+，修复缺陷32个，擅长用数据驱动项目优化与效率提升。"]
    },
    {
      id: "teaching-operation",
      title: "教学与运营能力",
      description: "具备专业的个性化教学与学员服务能力，擅长学情诊断、教案设计与学习进度管理；同时拥有独立内容运营经验，可完成账号策划、内容创作、数据复盘全链路工作。",
      tags: ["个性化教学", "学员运营", "内容策划", "账号运营"],
      highlights: ["教学续课率90%+，独立运营小红书账号粉丝1260+，单篇最高阅读120万，内容与教学能力双突出。"]
    },
    {
      id: "soft-skills",
      title: "综合软实力",
      description: "具备优秀的跨岗位、跨文化沟通能力，学习适应力强，执行落地高效，擅长公众表达、活动统筹与临场应变，是团队中可靠、高效、高配合度的核心成员。",
      tags: ["跨团队沟通", "快速学习", "项目执行", "公众表达"],
      highlights: ["沟通协作流畅，学习适应力极强，执行落地稳定可靠，具备优秀的临场表达与组织能力。"]
    },
    {
      id: "cross-disciplinary",
      title: "跨学科拓展能力",
      description: "以计算机科学为基础，融合机器学习与新闻传播学知识，形成\"技术+AI+内容传播\"的跨学科优势，擅长用多领域视角解决复杂问题。",
      tags: ["跨学科整合", "机器学习基础", "传播逻辑"],
      highlights: ["技术+AI+传播三领域融合，具备差异化竞争力，适合复合型岗位与创新型工作场景。"]
    }
  ],
  radarSkills: ["计算机专业技能", "项目与实战能力", "教学与运营能力", "综合软实力", "跨学科拓展能力"],
  radarValues: [85, 88, 92, 90, 78],
  education: [
    {
      id: "edu-1",
      school: "某某大学",
      degree: "本科",
      major: "计算机科学与技术",
      period: "2023.09 - 2027.06",
      description: "GPA: 3.8/4.0 | 专业排名: 前5% | 校级奖学金",
      sortOrder: 1
    }
  ],
  experience: [
    {
      id: "exp-1",
      company: "某某科技有限公司",
      position: "后端开发实习生",
      period: "2025.06 - 2025.08",
      description: [
        "参与公司核心业务系统的开发与维护",
        "优化数据库查询，将响应时间提升30%",
        "编写单元测试，代码覆盖率达到85%",
        "参与代码审查，提升团队代码质量"
      ],
      achievements: ["优化数据库查询，响应时间提升30%", "代码覆盖率达到85%"],
      sortOrder: 1
    }
  ],
  projects: [
    {
      id: "project-1",
      title: "个人求职展示中心",
      description: "一个现代化的个人求职展示网站，包含简历、项目展示、知识库等功能模块",
      tags: ["Next.js", "React", "Tailwind CSS", "ECharts"],
      githubUrl: "https://gitee.com/weizhichun/self-web",
      demoUrl: "https://weizhichun.dev",
      isPublic: true,
      period: "2025.03 - 2025.05",
      details: "这是一个使用 Next.js 15 和 Tailwind CSS 构建的现代化个人求职展示网站。包含完整的路由系统、暗色模式支持、响应式设计，以及 PDF 简历导出功能。"
    },
    {
      id: "project-2",
      title: "在线学习平台",
      description: "一个功能完善的在线学习平台，支持课程管理、视频播放、作业提交等功能",
      tags: ["Vue3", "Spring Boot", "MySQL", "Redis"],
      githubUrl: "https://gitee.com/weizhichun/online-learning",
      isPublic: true,
      period: "2024.09 - 2024.12",
      details: "一个基于前后端分离架构的在线学习平台。前端使用 Vue3 + Element Plus，后端使用 Spring Boot + MyBatis Plus，支持课程管理、视频播放、作业提交、在线考试等功能。"
    },
    {
      id: "project-3",
      title: "智能聊天机器人",
      description: "基于大语言模型的智能聊天机器人，支持多轮对话和知识库问答",
      tags: ["Python", "FastAPI", "LangChain", "Vector DB"],
      isPublic: false,
      period: "2024.06 - 2024.08",
      details: "一个智能聊天机器人项目，集成了大语言模型 API，支持多轮对话、知识库问答、文件上传解析等功能。"
    }
  ],
  knowledge: [
    {
      id: "knowledge-1",
      title: "React Hooks 最佳实践",
      category: "前端",
      content: "本文介绍 React Hooks 的最佳实践，包括 useState、useEffect、useContext、useReducer 等常用 Hook 的使用方法和注意事项...",
      tags: ["React", "Hooks", "前端"],
      createdAt: "2025-05-20"
    },
    {
      id: "knowledge-2",
      title: "数据库索引优化指南",
      category: "数据库",
      content: "数据库索引是提升查询性能的关键。本文详细介绍索引的原理、类型、创建原则以及常见的优化策略...",
      tags: ["MySQL", "索引", "性能优化"],
      createdAt: "2025-04-15"
    },
    {
      id: "knowledge-3",
      title: "Git 工作流程详解",
      category: "工具",
      content: "Git 是现代软件开发中不可或缺的版本控制工具。本文介绍常见的 Git 工作流程，包括 Git Flow、GitHub Flow 等...",
      tags: ["Git", "版本控制", "协作开发"],
      createdAt: "2025-03-10"
    }
  ]
};
