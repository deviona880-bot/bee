/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'localhost:5000', 'localhost'],
  },
};

module.exports = nextConfig;
