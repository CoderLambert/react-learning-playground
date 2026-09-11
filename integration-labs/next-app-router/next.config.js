const path = require("node:path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  outputFileTracingRoot: path.resolve(__dirname),
};

module.exports = nextConfig;
