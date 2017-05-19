// @flow
import Prismic from 'prismic.io';
import {prismicApi} from '../services/prismic-api';

export const getCohorts = async () => {
  const api = await prismicApi();
  const response = await api.query(Prismic.Predicates.at('document.type', 'featurescohort'));
  const results = response.results;
  const cohorts = results.map((item) => {
    const cohort = item.rawJSON.featurescohort;
    const cohortName = cohort.cohortName.value;
    return cohortName;
  });

  return cohorts;
};
