/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.pexels.com",
      "another-domain.com",
      "third-domain.net",
      "png.pngtree.com",
      "d1csarkz8obe9u.cloudfront.net",
      "storage.googleapis.com",
      "lh3.googleusercontent.com",
    ],
  },
  // env: {
  //   BASE_URL: process.env.BASE_URL,
  //   PEXELS_API_KEY: process.env.PEXELS_API_KEY,
  //   NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  //   SITE_URL: process.env.SITE_URL,
  // },
};

export default nextConfig;
