/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — produces /out directory with plain HTML/JS/CSS for CDN hosting
  output: 'export',

  // Cloudflare Pages doesn't run the Next.js image optimizer
  images: { unoptimized: true },

  // Trailing slash makes static-host routing more predictable (CF Pages handles both)
  trailingSlash: false,

  reactStrictMode: true,
};

export default nextConfig;
