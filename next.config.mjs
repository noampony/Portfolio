import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Pin the workspace root to this project. Without it, Next.js walks up the tree, finds a
    // stray lockfile higher up (e.g. ~/package-lock.json) and infers the wrong root — which
    // emits the "inferred your workspace root" warning and can break file tracing.
    root: projectRoot,
  },
};

export default nextConfig;
