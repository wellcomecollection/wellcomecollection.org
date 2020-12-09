const chromium = 'chromium';
const allSupportedBrowsers = [chromium, 'firefox', 'webkit'];
const defaultMobileDevices = ['iPhone 11'];
const platform = process.env.platform ? process.env.platform : 'desktop';
const debug = !!process.env.debug;
const browsers =
  process.env.browsers === 'all' ? allSupportedBrowsers : [chromium];

function getLaunchOptions() {
  const launchOptions = {
    'jest-playwright': {
      browsers: browsers,
      launchOptions: {
        headless: !debug,
        devtools: !debug,
      },
    },
  };
  return platform === 'mobile'
    ? {
        ...launchOptions,
        'jest-playwright': {
          ...launchOptions['jest-playwright'],
          devices: defaultMobileDevices,
        },
      }
    : launchOptions;
}

module.exports = {
  preset: 'jest-playwright-preset',
  testMatch: ['**/e2e/**/*.test.ts'],
  testEnvironmentOptions: getLaunchOptions(),
};
