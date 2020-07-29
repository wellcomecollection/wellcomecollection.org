// @flow
import fetch from 'isomorphic-unfetch';

export default async (useStaging: boolean) =>
  fetch(
    `https://api${
      useStaging ? '-stage' : ''
    }.wellcomecollection.org/catalogue/v2/swagger.json`
  ).then(resp => resp.json());
