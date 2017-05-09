// @flow
import Prismic from 'prismic.io';

export const getCohorts = async () => {
  const api = await Prismic.api('http://wellcomecollection.prismic.io/api');
  const response = await api.query(Prismic.Predicates.at('document.type', 'featurescohort'));
  const results = response.results;
  const cohorts = results.map((item) => {
    const cohort = item.rawJSON.featurescohort;
    const cohortName = cohort.cohortName.value;
    return cohortName;
  });

  return cohorts;
};
