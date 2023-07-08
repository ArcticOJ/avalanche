const withAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

/** @type {import('next').NextConfig} */
module.exports = withAnalyzer({
  output: 'export',
  images: {
    unoptimized: true
  },
  reactStrictMode: false
});
