import superagent from 'superagent';

export default async () => {
  const redirectsUrl = `https://cdn.rawgit.com/davidpmccormick/davidpmccormick.github.io/master/redirects.json`;
  const response = await superagent.get(redirectsUrl);

  return response.body;
};
