// @flow
import Prismic from 'prismic.io';

export const getFlags = async () => {
  const api = await Prismic.api('https://wellcomecollection.prismic.io/api');
  const flagsResponse = await api.query(Prismic.Predicates.at('document.type', 'featureflag'));
  const cohortsResponse = await api.query(Prismic.Predicates.at('document.type', 'featurescohort'));
  const flags = flagsResponse.results.reduce((result, item) => {
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
  const cohorts = cohortsResponse.results.map((item) => {
    const cohort = item.rawJSON.featurescohort;
    const cohortName = cohort.cohortName.value;
    return cohortName;
  });
  return [flags, cohorts];
};
