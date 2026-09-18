import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";

import { ARCHITECTURE_OWNERS } from "../architecture/ownership-manifest.mjs";

const REPOSITORY_ROOT = fileURLToPath(new URL("../", import.meta.url));
const DEFAULT_BROWSER_SPEC_DIRECTORY = fileURLToPath(new URL("../tests/e2e/", import.meta.url));
const BROWSER_OWNER_METADATA = /@browser-owner\s+([a-z][a-z0-9-]*)/g;
const ARCHITECTURE_OWNER_BY_ID = new Map(
  ARCHITECTURE_OWNERS.map((owner) => [owner.id, owner]),
);

function normalizeRepositoryPath(value) {
  return String(value ?? "").replaceAll("\\", "/").replace(/^\.\//, "");
}

function suitePath(directory, file) {
  return normalizeRepositoryPath(relative(REPOSITORY_ROOT, join(directory, file)));
}

function assertValidBrowserOwner(suite, ownerId) {
  const owner = ARCHITECTURE_OWNER_BY_ID.get(ownerId);
  if (!owner || !["domain", "integration"].includes(owner.kind)) {
    throw new Error(
      `Browser suite ${suite} has unknown or unsupported ARCH1 owner ${ownerId}`,
    );
  }
  if (!["domain", "full"].includes(owner.browserImpact)) {
    throw new Error(
      `Browser suite ${suite} has owner ${ownerId} without a browser-impact classification`,
    );
  }
  return owner;
}

export async function discoverBrowserSuiteOwnership(
  directory = DEFAULT_BROWSER_SPEC_DIRECTORY,
) {
  const files = (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".spec.js"))
    .map((entry) => entry.name)
    .sort();

  const ownership = [];
  for (const file of files) {
    const suite = suitePath(directory, file);
    const source = await readFile(join(directory, file), "utf8");
    const owners = [...source.matchAll(BROWSER_OWNER_METADATA)].map((match) => match[1]);
    if (owners.length !== 1) {
      throw new Error(
        `Browser suite ${suite} must declare exactly one @browser-owner metadata entry; found ${owners.length}`,
      );
    }
    const [owner] = owners;
    assertValidBrowserOwner(suite, owner);
    ownership.push(Object.freeze({ suite, owner }));
  }

  const suites = ownership.map(({ suite }) => suite);
  if (new Set(suites).size !== suites.length) {
    throw new Error("Browser suite ownership contains duplicate suite paths");
  }
  if (ownership.length === 0) {
    throw new Error("Browser suite ownership contains no browser specs");
  }
  return Object.freeze(ownership);
}

export const BROWSER_SUITE_OWNERSHIP = await discoverBrowserSuiteOwnership();

const coreOwnership = BROWSER_SUITE_OWNERSHIP.filter(({ owner }) => (
  ARCHITECTURE_OWNER_BY_ID.get(owner)?.kind === "integration"
));
const domainOwnership = BROWSER_SUITE_OWNERSHIP.filter(({ owner }) => (
  ARCHITECTURE_OWNER_BY_ID.get(owner)?.kind === "domain"
));

export const CORE_BROWSER_SUITES = Object.freeze(
  coreOwnership.map(({ suite }) => suite).sort(),
);

export const DOMAIN_BROWSER_SUITES = Object.freeze(
  Object.fromEntries(
    [...new Set(domainOwnership.map(({ owner }) => owner))]
      .sort()
      .map((domain) => [
        domain,
        Object.freeze(
          domainOwnership
            .filter(({ owner }) => owner === domain)
            .map(({ suite }) => suite)
            .sort(),
        ),
      ]),
  ),
);

export const SUPPORTED_BROWSER_DOMAINS = Object.freeze(
  Object.keys(DOMAIN_BROWSER_SUITES).sort(),
);

export const ALL_BROWSER_SUITES = Object.freeze([
  ...CORE_BROWSER_SUITES,
  ...Object.values(DOMAIN_BROWSER_SUITES).flat(),
].sort());

export function getBrowserSuiteSelection(tier, domain = null) {
  if (tier === "NONE") {
    return {
      executedSuites: [],
      skippedSuites: [...ALL_BROWSER_SUITES],
    };
  }

  if (tier === "FULL") {
    return {
      executedSuites: [...ALL_BROWSER_SUITES],
      skippedSuites: [],
    };
  }

  const domainSuites = DOMAIN_BROWSER_SUITES[domain];
  if (tier !== "DOMAIN" || !domainSuites) {
    throw new Error(`Unsupported browser verification selection: ${tier}:${domain ?? "none"}`);
  }

  const executedSuites = [...CORE_BROWSER_SUITES, ...domainSuites].sort();
  const executedSuiteSet = new Set(executedSuites);
  return {
    executedSuites,
    skippedSuites: ALL_BROWSER_SUITES.filter((suite) => !executedSuiteSet.has(suite)),
  };
}
