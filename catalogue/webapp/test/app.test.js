const React = require('react');
const next = require('next');

try {
  const app = next({
    dev: false
  });
} catch (e) {
  console.info(e);
}

// const handle = app.getRequestHandler();

it('should render', async () => {
  // const render = await app.render({}, {}, '/work', {
  //   page: 1,
  //   query: 'botany',
  //   id: 'cjep3rpp',
  //   flags: {}
  // });
  console.info('asd');
});
