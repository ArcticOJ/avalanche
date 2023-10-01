const withYaml = require('next-plugin-yaml');

/** @type {import('next').NextConfig} */
module.exports = withYaml({
  output: 'export',
  images: {
    unoptimized: true
  },
  reactStrictMode: false
});
