// @flow
import Prismic from 'prismic.io';
import {prismicApi} from '../services/prismic-api';

export const getFlags = async () => {
  const api = await prismicApi();
  const response = await api.query(Prismic.Predicates.at('document.type', 'featureflag'));
  const results = response.results;
  const flags = results.reduce((result, item) => {
    const flag = item.rawJSON.featureflag;
    const flagName = flag.flagName.value;
    const cohortSettings = flag.flagCohortSettings.value;
    const settings = cohortSettings.reduce((result, item) => {
      const cohortName = item.featuresCohort.value.document.slug;
      const cohortSetting = item.flagStatus.value;
      result[cohortName] = cohortSetting;
      return result;
    }, {});

    result[flagName] = settings;
    return result;
  }, {});

  return flags;
};
