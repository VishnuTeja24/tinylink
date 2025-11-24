module.exports = {
  reactStrictMode: false,
  output: "standalone",

  // VERY IMPORTANT:
  experimental: {
    serverActions: true,
  },

  // Force all dynamic pages to be server-rendered
  generateEtags: false,
};
