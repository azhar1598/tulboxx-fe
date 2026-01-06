/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "another-domain.com" },
      { protocol: "https", hostname: "third-domain.net" },
      { protocol: "https", hostname: "png.pngtree.com" },
      { protocol: "https", hostname: "d1csarkz8obe9u.cloudfront.net" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
