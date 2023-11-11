/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kcacsikcp6kpwfbn.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      }
    ],
  },
};

module.exports = nextConfig;
