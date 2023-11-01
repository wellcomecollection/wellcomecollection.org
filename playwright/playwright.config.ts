import { PlaywrightTestConfig, devices } from '@playwright/test';

const chromium = 'chromium' as const;
const allSupportedBrowsers = [chromium, 'firefox'] as const;
const mobileDeviceNames = ['Galaxy S8'] as const;
const platform = process.env.platform ? process.env.platform : 'desktop';
const debug = !!process.env.debug;
const browsers =
  process.env.browsers === 'all' ? allSupportedBrowsers : [chromium];

const config: PlaywrightTestConfig = {
  timeout: 60000,
  use: {
    headless: !debug,
  },
  projects:
    platform === 'desktop'
      ? browsers.map(browser => ({
          name: browser,
          use: {
            browserName: browser,
          },
        }))
      : mobileDeviceNames.map(deviceName => ({
          name: deviceName,
          use: { ...devices[deviceName] },
        })),
};

export default config;
