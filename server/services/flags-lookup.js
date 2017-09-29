// @flow
import Prismic from 'prismic-javascript';
import {RichText} from 'prismic-dom';

export const getFlags = async () => {
  const api = await Prismic.api('https://wellcomecollection.prismic.io/api/v2');
  const flagsResponse = await api.query(Prismic.Predicates.at('document.type', 'featureflag'), {fetchLinks: [
    'featurescohort.cohortName'
  ]});
  const cohortsResponse = await api.query(Prismic.Predicates.at('document.type', 'featurescohort'));
  const flags = flagsResponse.results.reduce((result, item) => {
    const flag = item.data;
    const flagName = flag.flagName;
    const cohortSettings = flag.flagCohortSettings;
    const settings = cohortSettings.reduce((result, item) => {
      if (item.featuresCohort.data) {
        const cohortName = item.featuresCohort.data.cohortName;
        const cohortBooleanSetting = item.flagStatus;
        const cohortValue = RichText.asText(item.flagValue).trim();
        if (cohortValue.length > 0) {
          result[cohortName] = cohortValue;
        } else {
          result[cohortName] = cohortBooleanSetting;
        }
        return result;
      }
    }, {});

    result[flagName] = settings;
    return result;
  }, {});

  const cohorts = cohortsResponse.results.map((item) => {
    const cohort = item.data;
    const cohortName = cohort.cohortName;
    return cohortName;
  });

  return [flags, cohorts];
};
