import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/react-learning-playground/",
  plugins: [
    {
      // Run MDX before Vite core transforms. This lets the filter see `?raw`
      // and skip those requests so Vite's raw-text loader can handle them.
      enforce: "pre",
      ...mdx({
        include: /\.mdx(?:$|\?)/,
        exclude: /[?&]raw(?:&|$)/,
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      }),
    },
    react(),
  ],
});
