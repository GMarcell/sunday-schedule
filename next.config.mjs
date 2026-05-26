/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      pdfkit: "pdfkit/js/pdfkit.js",
    },
  },
};

export default nextConfig;
