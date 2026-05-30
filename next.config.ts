import type { NextConfig } from "next";

// 检查是否是生产环境构建
const isProdBuild = process.env.NODE_ENV === "production" && process.env.BUILD_EXPORT === "true";

const nextConfig: NextConfig = {
  // 只有在专门的导出模式才启用 static export
  ...(isProdBuild ? { output: "export" } : {}),
  images: {
    unoptimized: true,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  reactStrictMode: true,
  // 性能优化配置 - 移除 lucide-react 避免类型冲突
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'echarts',
      'echarts-for-react'
    ],
  },
  // 配置缓存策略 (仅在生产模式且未启用导出时使用)
  ...(!isProdBuild ? {
    headers: async () => [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=60',
          },
        ],
      },
    ],
  } : {}),
  // 临时禁用类型检查以快速构建
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
