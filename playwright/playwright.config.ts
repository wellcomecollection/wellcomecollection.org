import { devices, PlaywrightTestConfig } from '@playwright/test';

const chromium = 'chromium' as const;
const allSupportedBrowsers = [chromium, 'firefox'] as const;
const mobileDeviceNames = ['Galaxy S8'] as const;
const platform = process.env.platform ? process.env.platform : 'desktop';
const debug = !!process.env.debug;
const browsers =
  process.env.browsers === 'all' ? allSupportedBrowsers : [chromium];

// GTM is configured to block the GA4 tag when this marker is present in the
// User-Agent, so e2e runs (including against prod) don't pollute analytics
// data. It's appended to the real browser UA (rather than replacing it) so
// WAF bot detection and in-app UA sniffing still see a genuine browser.
const e2eUserAgentSuffix = ' wellcomecollection-e2e-test';

type SupportedBrowser = (typeof allSupportedBrowsers)[number];

// Keyed by the full SupportedBrowser union, so adding a browser to
// allSupportedBrowsers without adding its UA here is a compile error.
const desktopUserAgents: Record<SupportedBrowser, string> = {
  chromium: devices['Desktop Chrome'].userAgent,
  firefox: devices['Desktop Firefox'].userAgent,
};

const config: PlaywrightTestConfig = {
  use: {
    headless: !debug,
  },
  projects:
    platform === 'desktop'
      ? browsers.map(browser => ({
          name: browser,
          use: {
            browserName: browser,
            userAgent: desktopUserAgents[browser] + e2eUserAgentSuffix,
          },
        }))
      : mobileDeviceNames.map(deviceName => ({
          name: deviceName,
          use: {
            ...devices[deviceName],
            userAgent: devices[deviceName].userAgent + e2eUserAgentSuffix,
          },
        })),
};

export default config;
