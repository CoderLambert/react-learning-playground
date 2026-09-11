import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/react-learning-playground/",
  plugins: [
    mdx({
      // Keep `?raw` MDX imports on Vite's raw-text path so the AI context
      // receives the original note source instead of a compiled React component.
      include: /\.mdx(?:$|\?)/,
      exclude: /[?&]raw(?:&|$)/,
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug],
    }),
    react(),
  ],
});
