export const ARCHITECTURE_MANIFEST_VERSION = 1;

export const ARCHITECTURE_OWNERS = [
  {
    id: "app-integration",
    kind: "integration",
    exactPaths: ["src/App.jsx", "src/main.jsx"],
    prefixes: [],
    publicEntries: [],
    browserImpact: "full",
  },
  {
    id: "ai",
    kind: "domain",
    exactPaths: [],
    prefixes: ["src/ai/"],
    publicEntries: ["src/ai/public.js"],
    browserImpact: "domain",
  },
  {
    id: "assessment",
    kind: "domain",
    exactPaths: [],
    prefixes: ["src/assessment/"],
    publicEntries: ["src/assessment/public.js"],
    browserImpact: "domain",
  },
  {
    id: "workbench",
    kind: "domain",
    exactPaths: [],
    prefixes: ["src/workbench/"],
    publicEntries: ["src/workbench/public.js"],
    browserImpact: "domain",
  },
  {
    id: "learning-actions",
    kind: "domain",
    exactPaths: [],
    prefixes: ["src/learning-actions/"],
    publicEntries: [],
    browserImpact: "domain",
  },
  {
    id: "content-source",
    kind: "domain",
    exactPaths: [],
    prefixes: ["src/source/", "src/content/"],
    publicEntries: [],
    browserImpact: "domain",
  },
  {
    id: "platform",
    kind: "platform",
    exactPaths: [],
    prefixes: ["src/platform/"],
    publicEntries: [],
    browserImpact: "shared",
  },
  {
    id: "ci",
    kind: "tooling",
    exactPaths: ["package.json", "package-lock.json"],
    prefixes: [".github/workflows/", "scripts/", "architecture/"],
    publicEntries: [],
    browserImpact: "shared",
  },
];

export const SHARED_INTEGRATION_SURFACES = [
  {
    id: "app-composition-root",
    paths: ["src/App.jsx", "src/main.jsx"],
    owner: "app-integration",
    policy: "one-writer-per-wave",
  },
  {
    id: "package-contract",
    paths: ["package.json", "package-lock.json"],
    owner: "ci",
    policy: "coordinate-before-write",
  },
  {
    id: "required-workflows",
    paths: [".github/workflows/**"],
    owner: "ci",
    policy: "coordinate-before-write",
  },
  {
    id: "global-styles",
    paths: ["src/App.css", "src/index.css"],
    owner: "app-integration",
    policy: "one-writer-per-wave",
  },
  {
    id: "demo-registry",
    paths: ["src/demos/index.js"],
    owner: "app-integration",
    policy: "coordinate-before-write",
  },
  {
    id: "mixed-components",
    paths: ["src/components/**"],
    owner: "shared-by-feature",
    policy: "derive-logical-owner-from-feature; do-not-assume-directory-owner",
  },
];

export function normalizeRepositoryPath(value) {
  return String(value ?? "")
    .replaceAll("\\", "/")
    .replace(/^\.\//, "")
    .replace(/\/+/g, "/");
}

export function getArchitectureOwner(filePath) {
  const normalized = normalizeRepositoryPath(filePath);

  for (const owner of ARCHITECTURE_OWNERS) {
    if (owner.exactPaths.includes(normalized)) return owner;
    if (owner.prefixes.some((prefix) => normalized.startsWith(prefix))) return owner;
  }

  return null;
}

export function isCuratedPublicEntry(ownerId, filePath) {
  const owner = ARCHITECTURE_OWNERS.find((candidate) => candidate.id === ownerId);
  if (!owner) return false;
  return owner.publicEntries.includes(normalizeRepositoryPath(filePath));
}

export function getBrowserImpactOwnership(filePath) {
  const owner = getArchitectureOwner(filePath);
  if (!owner) return { owner: "unknown", browserImpact: "full" };
  return { owner: owner.id, browserImpact: owner.browserImpact };
}
