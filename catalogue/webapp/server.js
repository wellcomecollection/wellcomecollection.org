const app = require('./app');
const port = process.argv[2] || process.env.NODE_ENV === 'test' ? 3001 : 3000;

app.then(server => {
  server.listen(port, err => {
    if (err) throw err;
    console.log(
      `> ${process.env.NODE_ENV ||
        'development'} ready on http://localhost:${port}/works`
    );
  });
});
