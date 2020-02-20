module.exports = {
  launch: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  server: {
    command: `node server.js`,
    port: 3001,
    launchTimeout: 20000,
  },
};
