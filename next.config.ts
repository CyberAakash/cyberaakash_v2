import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ["@splinetool/react-spline", "@splinetool/runtime"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
};

export default nextConfig;
