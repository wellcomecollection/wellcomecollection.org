export const baseUrl = process.env.PLAYWRIGHT_BASE_URL
  ? process.env.PLAYWRIGHT_BASE_URL
  : 'http://localhost:3000';
export const useStageApis = process.env.USE_STAGE_APIS
  ? process.env.USE_STAGE_APIS && process.env.USE_STAGE_APIS === 'true'
  : false;
export const worksUrl = `${baseUrl}/works`;
export const imagesUrl = `${baseUrl}/images`;

// Top-level pages
export const homepageUrl = `${baseUrl}`;
export const visitUsUrl = `${baseUrl}/visit-us`;
export const whatsOnUrl = `${baseUrl}/whats-on`;
export const storiesUrl = `${baseUrl}/stories`;
export const collectionsUrl = `${baseUrl}/collections`;
export const getInvolvedUrl = `${baseUrl}/get-involved`;
export const aboutUsUrl = `${baseUrl}/about-us`;
