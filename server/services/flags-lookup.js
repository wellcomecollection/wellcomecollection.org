// @flow
import superagent from 'superagent';

const uri = 'https://s3-eu-west-1.amazonaws.com/wellcomecollection-feature-flags/flag-groups.json';

export const getFlags = async () => {
  return superagent.get(uri).then((response) => {
    return response.body;
  }, (response) => {
    return {};
  });
};
