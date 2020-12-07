module.exports = {
  plugins: [
    [
      'postcss-easy-import',
      {
        prefix: '_',
      },
    ],
    [
      'autoprefixer',
      {
        grid: false,
      },
    ],
  ],
};
