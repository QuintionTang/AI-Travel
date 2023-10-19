/** @type {import('next').NextConfig} */

const securityHeaders = [
    {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
    },
];

const nextConfig = {
    reactStrictMode: true,
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: securityHeaders,
            },
        ];
    },
};

module.exports = nextConfig;
