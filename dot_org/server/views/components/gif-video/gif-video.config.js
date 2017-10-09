import { createPicture } from '../../../model/picture';

export const name = 'gif-video';
export const context = {
  model: {
    posterImage: createPicture({
      contentUrl: 'https://pbs.twimg.com/tweet_video_thumb/C_YvyiGXgAA7Arj.jpg',
      width: 1600,
      height: 900
    }),
    sources: [{
      url: 'https://video.twimg.com/tweet_video/C_YvyiGXgAA7Arj.mp4',
      fileFormat: 'video/mp4'
    }],
    caption: `Cats, because it's the internet`
  }
};
