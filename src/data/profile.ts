import { Profile } from "@/types";

export const profileData: Profile = {
  name: "魏智纯",
  age: 21,
  gender: "female",
  title: "数据新闻 / 科技内容暑期实习生",
  bio: "",
  email: "xxxibkkotnim@petalmail.com",
  phone: "17681329502",
  location: "安徽·芜湖",
  github: "https://gitee.com/weizhichun",
  linkedin: "",
  blog: "",
  avatar: "",
  skills: [],
  skillCategories: [
    {
      id: "data-processing",
      title: "数据处理与分析",
      description: "具备扎实的数据处理能力，熟练使用Python进行数据清洗、清洗与可视化，精通主题聚类、情感分析等机器学习方法，能够从海量UGC数据中提取有价值的信息。",
      tags: ["Python", "Pandas", "Scikit-learn", "数据清洗", "主题聚类", "情感分析"],
      highlights: ["独立处理10.5万条UGC数据，完成主题聚类与情感分析，提取8大消费动机、4个反常识行业洞察。"]
    },
    {
      id: "llm-application",
      title: "大模型应用能力",
      description: "深入理解大模型技术，具备Prompt工程实战经验，能够实现结构化JSON输出，精通多AI Provider适配与集成，具备RAG应用测试能力。",
      tags: ["讯飞星火", "通义千问", "OpenAI API", "Prompt工程", "RAG应用"],
      highlights: ["集成讯飞星火、通义千问、OpenAI三大AI Provider，实现笔记助手、知识问答、简历优化、面试模拟4个AI工具。"]
    },
    {
      id: "frontend-development",
      title: "前端开发能力",
      description: "具备现代化前端开发能力，精通Next.js、Vue3、TypeScript等技术栈，擅长ECharts交互可视化开发，支持响应式H5多端适配。",
      tags: ["Next.js 15", "Vue 3", "TypeScript", "ECharts", "响应式开发", "Tailwind CSS"],
      highlights: ["首屏加载0.8秒，Lighthouse性能得分95+，开发5个交互式可视化图表，搭建响应式H5专题页。"]
    },
    {
      id: "backend-development",
      title: "后端开发能力",
      description: "具备后端开发能力，精通Spring Boot、FastAPI、Kotlin Android等技术栈，能够独立完成RESTful API设计与实现。",
      tags: ["Spring Boot", "FastAPI", "Kotlin Android", "RESTful API", "MVVM架构"],
      highlights: ["基于FastAPI+Vue全栈开发舆情可视化工具，采用Kotlin+MVVM架构开发舆情分析APP。"]
    },
    {
      id: "content-operation",
      title: "内容运营能力",
      description: "具备数据新闻写作与内容运营能力，精通选题策划与热度验证，擅长多平台内容适配与传播文案撰写。",
      tags: ["数据新闻写作", "选题策划", "热度验证", "多平台适配", "内容传播"],
      highlights: ["为小红书/抖音/微博/B站/知乎/快手6个平台定制传播文案，验证小红书240万+、抖音580亿+选题热度。"]
    }
  ],
  radarSkills: ["数据处理与分析", "大模型应用能力", "前端开发能力", "后端开发能力", "内容运营能力"],
  radarValues: [85, 82, 88, 75, 90],
  education: [
    {
      id: "edu-1",
      school: "安徽师范大学皖江学院",
      degree: "本科",
      major: "计算机科学与技术",
      period: "2023.09 - 2027.06",
      description: "跨考新闻传播学研究生，专注AI与传播交叉领域，系统学习计算传播、数据新闻相关知识。核心课程：Python程序设计、数据库原理、计算机网络、Linux操作系统。",
      sortOrder: 1
    }
  ],
  experience: [
    {
      id: "exp-1",
      company: "南京万讯网络科技有限公司",
      position: "初级软件测试工程师",
      period: "2026.04 - 2026.05",
      description: [
        "参与公司业务系统功能测试，梳理业务需求，设计并执行90+全场景测试用例，覆盖核心业务流程",
        "协助定位与复现问题，提交规范缺陷报告，跟进20+缺陷修复与验证，保障版本上线质量"
      ],
      achievements: ["设计执行90+测试用例，跟进修复20+缺陷，保障版本上线质量"],
      sortOrder: 1
    },
    {
      id: "exp-2",
      company: "新东方教育科技集团",
      position: "雅思助教 & 运营实习生",
      period: "2025.07 - 2026.05",
      description: [
        "负责学员学情数据整理与复盘，同步调整辅导策略，负责学员续课率达90%以上",
        "协助校区招生运营，完成内容策划与用户咨询，助力校区引流获客"
      ],
      achievements: ["学员续课率90%+，协助校区招生引流获客"],
      sortOrder: 2
    },
    {
      id: "exp-3",
      company: "芜湖云帆信息技术",
      position: "软件测试实习生",
      period: "2025.03 - 2025.09",
      description: [
        "参与小型业务系统测试全流程，设计120+全场景测试用例，跟进修复32个缺陷",
        "跨团队对接开发、产品角色，快速定位问题，锻炼了高效跨角色沟通能力"
      ],
      achievements: ["设计120+测试用例，修复32个缺陷，锻炼跨团队沟通能力"],
      sortOrder: 3
    }
  ],
  projects: [
    {
      id: "project-1",
      title: "2026年Z世代情绪消费数据新闻专题",
      description: "独立完成全流程数据新闻项目，验证小红书240万+、抖音580亿+的选题热度，处理10.5万条UGC数据，搭建响应式H5专题页。",
      tags: ["Python", "ECharts", "H5开发", "数据新闻", "交互可视化"],
      githubUrl: "",
      demoUrl: "",
      isPublic: true,
      period: "2026.05",
      details: "独立完成全流程数据新闻项目，策划《2026年轻人情绪消费》热点选题，验证小红书240万+、抖音580亿+的选题热度。用Python处理10.5万条结构化UGC数据，完成主题聚类与情感分析，提取8大消费动机、4个反常识行业洞察。基于ECharts开发5个交互式可视化图表，搭建响应式H5专题页，适配手机/PC多端。为小红书/抖音/微博/B站/知乎/快手6个平台定制传播文案。"
    },
    {
      id: "project-2",
      title: "微博热点舆情传播路径可视化工具",
      description: "基于Python FastAPI + Vue 3全栈开发，集成通义千问大模型API实现AI情感三分类，使用Playwright采集数据，ECharts力导向图可视化传播路径。",
      tags: ["FastAPI", "Vue 3", "Playwright", "ECharts", "通义千问"],
      githubUrl: "",
      demoUrl: "",
      isPublic: true,
      period: "2026.03 - 2026.04",
      details: "基于Python FastAPI + Vue 3全栈开发，集成通义千问大模型API实现AI情感三分类（积极/中性/负面）。使用Playwright无头浏览器采集微博公开数据，ECharts力导向图可视化传播路径，折线图展示热度趋势。设计优雅降级机制：爬虫失败自动切换演示数据，API未配置降级为规则分析，保证功能完整可用。"
    },
    {
      id: "project-3",
      title: "大模型舆情分析Android APP",
      description: "采用Kotlin + MVVM架构，集成讯飞星火大模型API，实现情感分析、热点词云、观点总结、风险提示4大核心功能。",
      tags: ["Kotlin", "MVVM", "讯飞星火", "MPAndroidChart", "Room数据库"],
      githubUrl: "",
      demoUrl: "",
      isPublic: true,
      period: "2026.03 - 2026.04",
      details: "采用Kotlin + MVVM架构，集成讯飞星火大模型API，实现情感分析、热点词云、观点总结、风险提示4大核心功能。通过Prompt工程实现结构化JSON输出，MPAndroidChart饼图可视化情感占比，FlexboxLayout动态词云。Room数据库持久化存储分析历史，Retrofit网络请求层，Jetpack全家桶（ViewModel/LiveData/DataBinding）。"
    },
    {
      id: "project-4",
      title: "个人全栈知识管理网站",
      description: "基于Next.js 15 + TypeScript开发，集成求职展示、跨学科知识库、AI辅助工具3大模块，纯前端无后端架构。",
      tags: ["Next.js 15", "TypeScript", "IndexedDB", "Tailwind CSS", "AI集成"],
      githubUrl: "https://gitee.com/weizhichun/self-web",
      demoUrl: "",
      isPublic: true,
      period: "2026.01 - 2026.02",
      details: "基于Next.js 15 + TypeScript开发，集成求职展示、跨学科知识库、AI辅助工具3大模块，纯前端无后端架构。适配OpenAI/通义千问/文心一言多AI Provider，实现笔记助手、知识问答、简历优化、面试模拟4个AI工具。首屏加载0.8秒，Lighthouse性能得分95+，支持PDF简历生成、JSON数据导入导出，暗色主题切换。"
    },
    {
      id: "project-5",
      title: "在线商城系统",
      description: "基于Spring Boot + MyBatis-Plus + Maven多模块架构，实现用户、商品、购物车、订单完整电商链路。",
      tags: ["Spring Boot", "MyBatis-Plus", "Maven", "MySQL"],
      githubUrl: "",
      demoUrl: "",
      isPublic: false,
      period: "2025.01 - 2025.06",
      details: "基于Spring Boot + MyBatis-Plus + Maven多模块架构，实现用户、商品、购物车、订单完整电商链路。统一全局异常处理与返回结果集封装，文件上传三层安全验证（大小/类型/魔数）+ 多尺寸图片自动生成。"
    }
  ],
  knowledge: []
};
