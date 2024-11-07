import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/streamhub',
                permanent: true,
            },
        ];
    },
  /* config options here */
};

export default nextConfig;