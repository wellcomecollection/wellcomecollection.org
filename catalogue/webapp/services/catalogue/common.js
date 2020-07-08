import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { useContext } from 'react';

export const rootUris = {
  prod: 'https://api.wellcomecollection.org/catalogue',
  stage: 'https://api-stage.wellcomecollection.org/catalogue',
};

export type Toggles = { [key: string]: boolean };

export const isomorphicGetApiOptions = maybeToggles => {
  let toggles = maybeToggles;
  try {
    toggles = useContext(TogglesContext); // eslint-disable-line
  } catch (e) {
    if (!toggles) {
      throw new Error(
        'If using isomorphicGetApiOptions outside of a React component, a toggles object must be provided'
      );
    }
  }
  return {
    env: toggles.stagingApi ? 'stage' : 'prod',
    indexOverrideSuffix: toggles.miroMergingTest
      ? 'miro-merging-test'
      : undefined,
  };
};
