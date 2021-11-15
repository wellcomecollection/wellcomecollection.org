// we use IS_CI over NODE_ENV=test as NODE_ENV can be `test` locally.
export const isCi = process.env.IS_CI === 'true';
export const secrets = {
  PRISMIC_BEARER_TOKEN: `prismic-model/${
    isCi ? 'ci' : 'dev'
  }/prismic_bearer_token`,
};
