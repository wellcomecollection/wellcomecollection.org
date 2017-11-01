import superagent from 'superagent';

const accessToken = '974226659.98b6a08.3ec179d9232a4f4ea85f902954ec6761';

export async function getLatestInstagramPosts(count) {
  const resp = await superagent.get(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${accessToken}&count=${count}`);
  return resp.body.data.map(post => {
    return {
      id: post.id,
      screenName: post.user.username,
      type: post.type,
      comments: post.comments,
      likes: post.likes,
      caption: post.caption,
      createdAt: new Date(post.created_time * 1000),
      url: post.link,
      images: post.images
    };
  });
}
