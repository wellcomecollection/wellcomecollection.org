import { getLatestInstagramPosts } from '../../../services/instagram';
import { getLatestTweets } from '../../../services/twitter';

export const status = 'testing';
export const collated = true;

const latestInstagramPosts = getLatestInstagramPosts(10);
const latestTweets = getLatestTweets(4);

export const name = 'social-media-block';
export const preview = '@preview-no-container';

export const variants = [{
  name: 'default',
  label: 'Twitter',
  context: {
    model: {
      service: 'Twitter',
      handle: 'explorewellcome',
      icon: 'twitter',
      url: 'https://twitter.com/explorewellcome',
      posts: latestTweets
    }
  }
}, {
  name: 'Instagram',
  context: {
    model: {
      service: 'Instagram',
      handle: 'wellcomecollection',
      icon: 'instagram',
      url: 'https://www.instagram.com/wellcomecollection/',
      posts: latestInstagramPosts
    }
  }
}];
