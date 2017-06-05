import superagent from 'superagent';

const accessToken = '15985483.af7cf5e.f95d8a8480444201ab8a4af8709d0822';

export async function getLatestInstagramPosts() {
  return await superagent.get(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${accessToken}`)
    .then(response => {
      return response.body.data.map(post => {
        return {
          id: post.id,
          createdAt: new Date(post.created_time * 1000),
          url: post.link,
          images: post.images
        };
      });
    });
}
