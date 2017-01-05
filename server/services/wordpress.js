import request from 'superagent';

const baseUri = 'https://public-api.wordpress.com/rest/v1.1/sites/blog.wellcomecollection.org';

export async function getPosts() {
  const uri = `${baseUri}/posts/`;
  const response = await request(uri).query({fields: 'slug,title'});

  return response.body.posts;
}