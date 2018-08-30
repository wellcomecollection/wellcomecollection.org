import superagent from 'superagent';

// TODO: change 'redirect' (branch name) to 'master' in the redirectsUrl once merged
export default async () => {
  const redirectsUrl = `https://rawgit.com/wellcometrust/wellcomecollection.org/redirects/redirects/config.json`;
  const response = await superagent.get(redirectsUrl);

  return response.body;
};
