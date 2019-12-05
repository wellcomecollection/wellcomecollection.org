module.exports = {
  plugins: [
    require('postcss-easy-import')({ prefix: '_' }), // keep this first
    require('autoprefixer')({
      grid: false,
    }),
  ],
};
