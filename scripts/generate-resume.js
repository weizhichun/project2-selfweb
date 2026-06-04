const fs = require('fs');
const path = require('path');

// 简历数据
const resumeData = {
  name: "魏智纯",
  title: "数据新闻 / 科技内容暑期实习生",
  phone: "17681329502",
  email: "xxxibkkotnim@petalmail.com",
  location: "安徽·芜湖",
  github: "https://gitee.com/weizhichun",

  education: {
    school: "安徽师范大学皖江学院",
    major: "计算机科学与技术",
    degree: "本科",
    period: "2023.09 - 2027.06",
    description: "跨考新闻传播学研究生，专注AI与传播交叉领域，系统学习计算传播、数据新闻相关知识。核心课程：Python程序设计、数据库原理、计算机网络、Linux操作系统"
  },

  experience: [
    {
      company: "南京万讯网络科技有限公司",
      position: "初级软件测试工程师",
      period: "2026.04 - 2026.05",
      achievements: [
        "参与公司业务系统功能测试，梳理业务需求，设计并执行90+全场景测试用例，覆盖核心业务流程",
        "协助定位与复现问题，提交规范缺陷报告，跟进20+缺陷修复与验证，保障版本上线质量"
      ]
    },
    {
      company: "新东方教育科技集团",
      position: "雅思助教 & 运营实习生",
      period: "2025.07 - 2026.05",
      achievements: [
        "负责学员学情数据整理与复盘，同步调整辅导策略，负责学员续课率达90%以上",
        "协助校区招生运营，完成内容策划与用户咨询，助力校区引流获客"
      ]
    },
    {
      company: "芜湖云帆信息技术",
      position: "软件测试实习生",
      period: "2025.03 - 2025.09",
      achievements: [
        "参与小型业务系统测试全流程，设计120+全场景测试用例，跟进修复32个缺陷",
        "跨团队对接开发、产品角色，快速定位问题，锻炼了高效跨角色沟通能力"
      ]
    }
  ],

  projects: [
    {
      title: "2026年Z世代情绪消费数据新闻专题",
      period: "2026.05",
      description: "独立完成全流程数据新闻项目，策划《2026年轻人情绪消费》热点选题，验证小红书240万+、抖音580亿+的选题热度。用Python处理10.5万条结构化UGC数据，完成主题聚类与情感分析，提取8大消费动机、4个反常识行业洞察。基于ECharts开发5个交互式可视化图表，搭建响应式H5专题页，为6个平台定制传播文案。"
    },
    {
      title: "微博热点舆情传播路径可视化工具",
      period: "2026.03 - 2026.04",
      description: "基于Python FastAPI + Vue 3全栈开发，集成通义千问大模型API实现AI情感三分类。使用Playwright无头浏览器采集微博公开数据，ECharts力导向图可视化传播路径。设计优雅降级机制：爬虫失败自动切换演示数据，API未配置降级为规则分析。"
    },
    {
      title: "大模型舆情分析Android APP",
      period: "2026.03 - 2026.04",
      description: "采用Kotlin + MVVM架构，集成讯飞星火大模型API，实现情感分析、热点词云、观点总结、风险提示4大核心功能。通过Prompt工程实现结构化JSON输出，MPAndroidChart饼图可视化情感占比，Room数据库持久化存储分析历史。"
    },
    {
      title: "个人全栈知识管理网站",
      period: "2026.01 - 2026.02",
      description: "基于Next.js 15 + TypeScript开发，集成求职展示、跨学科知识库、AI辅助工具3大模块。适配OpenAI/通义千问/文心一言多AI Provider，实现笔记助手、知识问答、简历优化、面试模拟4个AI工具。首屏加载0.8秒，Lighthouse性能得分95+。"
    },
    {
      title: "在线商城系统",
      period: "2025.01 - 2025.06",
      description: "基于Spring Boot + MyBatis-Plus + Maven多模块架构，实现用户、商品、购物车、订单完整电商链路。统一全局异常处理与返回结果集封装，文件上传三层安全验证（大小/类型/魔数）+ 多尺寸图片自动生成。"
    }
  ],

  skills: [
    { category: "数据处理与分析", items: "Python、Pandas、Scikit-learn（主题聚类、情感分析）、数据清洗与可视化" },
    { category: "大模型应用", items: "讯飞星火/通义千问/OpenAI API集成、Prompt工程、结构化JSON输出、多Provider适配" },
    { category: "前端开发", items: "Next.js 15、Vue 3、TypeScript、ECharts交互可视化、响应式H5开发、Tailwind CSS" },
    { category: "后端开发", items: "Spring Boot、FastAPI、Kotlin Android（MVVM）、RESTful API设计" },
    { category: "数据库", items: "MySQL、SQLite、Room、IndexedDB" },
    { category: "内容能力", items: "数据新闻写作、选题策划与热度验证、多平台内容适配（小红书/抖音/微博/B站/知乎/快手）" },
    { category: "工具链", items: "Git、Linux、Vite、Maven、Playwright、Retrofit" }
  ]
};

// 生成 HTML 内容
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resumeData.name} - 简历</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: "Microsoft YaHei", "SimHei", Arial, sans-serif; font-size: 12pt; line-height: 1.6; color: #333; background: white; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
    .name { font-size: 26pt; font-weight: bold; margin-bottom: 10px; letter-spacing: 4px; }
    .job-title { font-size: 14pt; color: #666; margin-bottom: 15px; }
    .contact-info { font-size: 10pt; color: #555; }
    .contact-info span { margin: 0 10px; }
    .section { margin: 25px 0; }
    .section-title { font-size: 14pt; font-weight: bold; color: #333; border-left: 4px solid #333; padding-left: 10px; margin-bottom: 15px; }
    .item { margin-bottom: 18px; }
    .item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
    .item-title { font-weight: bold; font-size: 12pt; }
    .item-subtitle { color: #555; font-size: 11pt; margin-top: 3px; }
    .item-period { color: #666; font-size: 10pt; white-space: nowrap; }
    .item-content { font-size: 10pt; color: #444; padding-left: 15px; }
    .item-content li { margin: 6px 0; list-style-type: disc; }
    .skill-category { margin-bottom: 10px; font-size: 10pt; }
    .skill-name { font-weight: bold; color: #333; }
    .skill-items { color: #555; }
    a { color: #333; text-decoration: none; }
    @media print { body { padding: 20px; } .section { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${resumeData.name}</div>
    <div class="job-title">${resumeData.title}</div>
    <div class="contact-info">
      <span>📱 ${resumeData.phone}</span>
      <span>✉️ ${resumeData.email}</span>
      <span>📍 ${resumeData.location}</span>
      <span>🔗 ${resumeData.github}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">教育背景</div>
    <div class="item">
      <div class="item-header">
        <span class="item-title">${resumeData.education.school} | ${resumeData.education.major} | ${resumeData.education.degree}</span>
        <span class="item-period">${resumeData.education.period}</span>
      </div>
      <div class="item-content" style="padding-left:0;">${resumeData.education.description}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">实习经历</div>
    ${resumeData.experience.map(exp => `
    <div class="item">
      <div class="item-header">
        <div>
          <div class="item-title">${exp.company}</div>
          <div class="item-subtitle">${exp.position}</div>
        </div>
        <div class="item-period">${exp.period}</div>
      </div>
      <ul class="item-content">
        ${exp.achievements.map(ach => `<li>${ach}</li>`).join('')}
      </ul>
    </div>`).join('')}
  </div>

  <div class="section">
    <div class="section-title">项目经历</div>
    ${resumeData.projects.map(proj => `
    <div class="item">
      <div class="item-header">
        <div class="item-title">${proj.title}</div>
        <div class="item-period">${proj.period}</div>
      </div>
      <div class="item-content" style="padding-left:0;">${proj.description}</div>
    </div>`).join('')}
  </div>

  <div class="section">
    <div class="section-title">核心技能</div>
    ${resumeData.skills.map(skill => `
    <div class="skill-category">
      <span class="skill-name">${skill.category}：</span>
      <span class="skill-items">${skill.items}</span>
    </div>`).join('')}
  </div>
</body>
</html>`;

// 保存到根目录
const outputPath = path.join(__dirname, '..', 'resume.html');
fs.writeFileSync(outputPath, html, 'utf-8');

console.log('✅ 简历已生成！');
console.log('📄 文件位置:', outputPath);
console.log('\n💡 转换为 Word 文档的方法：');
console.log('方法1（推荐）：用 Word/WPS 直接打开 HTML 文件，然后另存为 .docx');
console.log('方法2：浏览器打开 → Ctrl+P → 另存为 PDF');
console.log('方法3：使用在线工具将 PDF 转换为 Word');
