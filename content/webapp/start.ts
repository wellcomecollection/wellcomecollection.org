import server from './server';
const port = process.argv[2] || (process.env.NODE_ENV === 'test' ? 3001 : 3000);

server.then(server => {
  server.listen(port, () => {
    console.log(
      `> ${process.env.NODE_ENV || 'development'
      } ready on http://localhost:${port}/`
    );
  });
});
