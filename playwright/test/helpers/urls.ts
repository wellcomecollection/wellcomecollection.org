export const baseUrl = process.env.PLAYWRIGHT_BASE_URL
  ? process.env.PLAYWRIGHT_BASE_URL
  : 'http://localhost:3000';
export const useStageApis = process.env.USE_STAGE_APIS
  ? process.env.USE_STAGE_APIS && process.env.USE_STAGE_APIS === 'true'
  : false;

// Top-level pages
export const homepageUrl = `${baseUrl}`;
export const whatsOnUrl = `${baseUrl}/whats-on`;
export const mediaOfficeUrl = `${baseUrl}/pages/WuxrKCIAAP9h3hmw`; // alias is /press but it doesn't work locally
