const { isEnabled } = require('unleash-client');

test('search for single tags and single ids', async () => {
  const { initialize } = require('unleash-client');
  initialize({
    url: 'https://weco-feature-flags.herokuapp.com/api/',
    appName: 'test',
    instanceId: 'test-instance',
    refreshInterval: 60 * 1000
  });

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
  expect(isEnabled('testSwitch')).toBe(true);
});
