import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";
import { sourceLocatorPlugin } from "./build/sourceLocatorPlugin.js";
import { sourceSemanticManifestPlugin } from "./build/sourceSemanticManifestPlugin.js";

const RAW_NOTE_REGISTRY_ID = "virtual:raw-mdx-note-registry";
const RESOLVED_RAW_NOTE_REGISTRY_ID = `\0${RAW_NOTE_REGISTRY_ID}`;
const RAW_NOTE_PREFIX = "virtual:raw-mdx-note/";
const RESOLVED_RAW_NOTE_PREFIX = `\0${RAW_NOTE_PREFIX}`;
const NOTE_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const NOTES_DIRECTORY = fileURLToPath(new URL("./src/content/notes", import.meta.url));

function getRawNoteIds() {
  return readdirSync(NOTES_DIRECTORY, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name.slice(0, -4))
    .filter((id) => NOTE_ID_PATTERN.test(id))
    .sort();
}

function rawMdxNotesPlugin() {
  return {
    name: "react-learning-raw-mdx-notes",
    enforce: "pre",

    resolveId(source) {
      if (source === RAW_NOTE_REGISTRY_ID) return RESOLVED_RAW_NOTE_REGISTRY_ID;

      if (source.startsWith(RAW_NOTE_PREFIX)) {
        const noteId = source.slice(RAW_NOTE_PREFIX.length);
        if (!NOTE_ID_PATTERN.test(noteId)) {
          throw new Error(`Invalid raw MDX note id: ${noteId}`);
        }
        return `${RESOLVED_RAW_NOTE_PREFIX}${noteId}`;
      }

      return null;
    },

    load(id) {
      if (id === RESOLVED_RAW_NOTE_REGISTRY_ID) {
        const entries = getRawNoteIds().map(
          (noteId) =>
            `${JSON.stringify(noteId)}: () => import(${JSON.stringify(`${RAW_NOTE_PREFIX}${noteId}`)}).then((module) => module.default)`,
        );

        return `export const RAW_NOTE_LOADERS = Object.freeze({\n${entries.join(",\n")}\n});`;
      }

      if (id.startsWith(RESOLVED_RAW_NOTE_PREFIX)) {
        const noteId = id.slice(RESOLVED_RAW_NOTE_PREFIX.length);
        if (!NOTE_ID_PATTERN.test(noteId)) {
          throw new Error(`Invalid resolved raw MDX note id: ${noteId}`);
        }

        const notePath = join(NOTES_DIRECTORY, `${noteId}.mdx`);
        this.addWatchFile(notePath);
        const source = readFileSync(notePath, "utf8");
        return `export default ${JSON.stringify(source)};`;
      }

      return null;
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: "/react-learning-playground/",
  plugins: [
    sourceLocatorPlugin(),
    sourceSemanticManifestPlugin(),
    rawMdxNotesPlugin(),
    {
      // MDX rendering and raw-note loading are deliberately separate paths.
      // The virtual raw-note plugin above reads the original MDX text, while
      // this compiler is responsible only for the React-rendered Notes view.
      enforce: "pre",
      ...mdx({
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      }),
    },
    react(),
  ],
});
