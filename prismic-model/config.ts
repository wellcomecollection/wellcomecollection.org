export const isCi = process.env.CI === 'true';
export const secrets = {
  PRISMIC_BEARER_TOKEN: `prismic-model/${
    isCi ? 'ci' : 'dev'
  }/prismic_bearer_token`,
};
