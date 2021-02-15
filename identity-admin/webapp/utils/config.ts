export const config = {
  remoteApi: {
    baseUrl: process.env.API_BASE_URL,
    apiKey: process.env.API_KEY,
  } as { baseUrl: string, apiKey: string }
};
