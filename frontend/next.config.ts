import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@worldcoin/idkit",
    "@worldcoin/idkit-core"
  ],
  serverExternalPackages: ["fhevmjs"]
};

export default nextConfig;
