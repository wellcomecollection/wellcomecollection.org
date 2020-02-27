// @flow
import fetch from 'isomorphic-unfetch';

export default async () =>
  fetch(
    'https://api.wellcomecollection.org/catalogue/v2/swagger.json'
  ).then(resp => resp.json());
