/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Existing WordPress assets are served from these hosts. When we migrate
    // images to S3/R2 later, add the new host here.
    remotePatterns: [
      { protocol: "https", hostname: "unstandard-members.com" },
      { protocol: "https", hostname: "unstandard.jp" },
    ],
  },
};

export default nextConfig;
