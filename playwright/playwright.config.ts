import { devices, PlaywrightTestConfig } from '@playwright/test';

const chromium = 'chromium' as const;
const allSupportedBrowsers = [chromium, 'firefox'] as const;
const mobileDeviceNames = ['Galaxy S8'] as const;
const platform = process.env.platform ? process.env.platform : 'desktop';
const debug = !!process.env.debug;
const browsers =
  process.env.browsers === 'all' ? allSupportedBrowsers : [chromium];

// GoogleTagManager (common/services/app/analytics-scripts/google-analytics.tsx)
// skips loading GTM at all when this marker is present in the User-Agent, so
// e2e runs (including against prod) don't pollute analytics data. It's
// appended to the real browser UA (rather than replacing it) so WAF bot
// detection and in-app UA sniffing still see a genuine browser.
//
// This can't be imported from @weco/common: playwright/Dockerfile only ever
// copies the playwright/ folder into the e2e test image, with no access to
// the rest of the monorepo's workspaces. Kept in sync by hand with
// E2E_TEST_USER_AGENT_MARKER in that file.
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
