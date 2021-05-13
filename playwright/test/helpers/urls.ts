export const baseUrl = process.env.PLAYWRIGHT_BASE_URL
  ? process.env.PLAYWRIGHT_BASE_URL
  : 'http://localhost:3000';
export const useStageApis = process.env.USE_STAGE_APIS
  ? process.env.USE_STAGE_APIS && process.env.USE_STAGE_APIS === 'true'
  : false;
export const worksUrl = `${baseUrl}/works`;
export const imagesUrl = `${baseUrl}/images`;
