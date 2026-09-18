import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/**
 * Pin the workspace root to this folder. Without it Turbopack walks up and
 * finds a stray package-lock.json in the user profile, which sits outside the
 * git repo, and warns on every start.
 */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: { root: projectRoot },
};

export default nextConfig;
