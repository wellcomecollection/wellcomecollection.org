import type { GifVideo } from '../../../model/gif-video';
import { createGifVideo } from '../../../model/gif-video';
import { createPicture } from '../../../model/picture';

const context: GifVideo = createGifVideo({
  sources: [{
    url: 'https://video.twimg.com/tweet_video/C_YvyiGXgAA7Arj.mp4',
    fileFormat: 'video/mp4'
  }],
  caption: 'Cats because it\'s the internet',
  posterImage: createPicture({
    width: 1600,
    height: 900,
    type: 'picture',
    contentUrl: 'https://pbs.twimg.com/tweet_video_thumb/C_YvyiGXgAA7Arj.jpg'
  })
});

export const name = 'gif-video';
export { context };
