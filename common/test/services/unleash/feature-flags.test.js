import { isEnabled } from 'unleash-client';
import { initialize } from '../../../services/unleash/feature-flags';

test('Test that flags are working', async () => {
  initialize({
    url: 'https://weco-feature-flags.herokuapp.com/api/',
    appName: 'test',
    instanceId: 'test-instance',
    refreshInterval: 60 * 1000
  });

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1500);
  });

  expect(
    isEnabled('testSwitch', {
      cohort: 'small'
    })).toBe(true);
});
