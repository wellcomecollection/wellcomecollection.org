const request = require('superagent');

async function getToken() {
  const uri = 'https://auth.docker.io/token?service=registry.docker.io&scope=repository:wellcome/wellcomecollection:pull';
  const resp = await request.get(uri);
  const token = resp.body.token;

  return token;
}

export async function listTags() {
  const uri = 'https://registry.hub.docker.com/v2/wellcome/wellcomecollection/tags/list';
  const token = await getToken();
  const resp = await request.get(uri).set('Authorization', `Bearer ${token}`);
  const tags = resp.body.tags;

  return tags;
}
