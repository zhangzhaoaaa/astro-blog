import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
// import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import { remarkModifiedTime } from "./remark-modified-time.mjs";
import vercel from "@astrojs/vercel";
import { remarkReadingTime } from "./src/utils/remark-reading-time";
import rehypeToc from "rehype-toc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
  ],
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append" }],
      [
        rehypeToc as any,
        {
          headings: ["h1", "h2", "h3"], // 指定生成目录的标题级别
          cssClasses: { toc: "toc", link: "toc-link" }, // 自定义 CSS 类
        },
      ],
    ],
    remarkPlugins: [
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
      remarkModifiedTime,
      remarkReadingTime,
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  scopedStyleStrategy: "where",
});
