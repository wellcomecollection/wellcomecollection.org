export const rootUris = {
  prod: 'https://api.wellcomecollection.org/catalogue',
  stage: 'https://api-stage.wellcomecollection.org/catalogue',
};

export type Toggles = { [key: string]: boolean };

export const globalApiOptions = (toggles: Toggles) => ({
  env: toggles.stagingApi ? 'stage' : 'prod',
  indexOverrideSuffix: toggles.miroMergingTest
    ? 'miro-merging-test' // This is an index alias, not an actual index name
    : undefined,
});
