import { isEnabled } from 'unleash-client';
import { initialize } from '../../../services/unleash/feature-flags';

test('Test that flags are working', async () => {
  initialize({
    appName: 'test',
    instanceId: 'test-instance'
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
