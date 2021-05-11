export const baseUrl = process.env.PLAYWRIGHT_BASE_URL
  ? process.env.PLAYWRIGHT_BASE_URL
  : 'http://localhost:3000';
export const worksUrl = `${baseUrl}/works`;
export const imagesUrl = `${baseUrl}/images`;
export const useStageApis = 'USE_STAGE_APIS' in process.env;
