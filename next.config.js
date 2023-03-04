const withAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

const removeImports = require('next-remove-imports')({
  options: {}
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false
};

module.exports = removeImports({
  ...withAnalyzer(nextConfig),
  webpack(config, options) {
    return config;
  }
});
