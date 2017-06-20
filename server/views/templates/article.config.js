import { createPromo } from '../../model/promo';
import { createPicture } from '../../model/picture';
import { ArticleStubFactory } from '../../model/article-stub';
import mockJson from '../../test/mocks/wp-api.json';

export const name = 'article';
export const handle = 'article-template';
export const status = 'graduated';

const article = ArticleStubFactory.fromWpApi(mockJson);

const promo = createPromo({
  contentType: 'article',
  image: article.thumbnail,
  title: article.headline,
  url: article.url,
  description: article.description
});

const mainMediaPicture = createPicture({
  type: 'picture',
  contentUrl: 'https://placehold.it/1600x900',
  width: 1600,
  height: 900,
  caption: `'Choose safer sex' poster with a photograph of two men in bed`
});

const gifVideoPoster = createPicture({
  contentUrl: 'https://pbs.twimg.com/tweet_video_thumb/C_YvyiGXgAA7Arj.jpg',
  width: 1600,
  height: 900
});

const smallPicture = createPicture({
  contentUrl: 'https://placehold.it/400x225',
  caption: 'Copyright Holder',
  author: `Author's name`,
  width: 400,
  height: 225,
  copyrightHolder: 'copyright holder',
  fileFormat: 'png'
});

const largePicture = Object.assign({}, smallPicture, {contentUrl: 'https://placehold.it/900x500', width: 900, height: 500});
const standalonePicture = Object.assign({}, largePicture, {weight: 'standalone'});

const htmlBlock = {
  type: 'html',
  value: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at volutpat erat. Quisque non eros viverra, tincidunt mi a, interdum libero. Vestibulum efficitur ex sed est interdum, ac placerat enim blandit. Phasellus sodales velit non est bibendum tincidunt. Phasellus ut ligula at velit congue lobortis. Fusce at suscipit purus, ac tincidunt orci.</p>`
};

const standfirst = Object.assign({}, htmlBlock, {type: 'standfirst'});

export const context = {
  transporter: '@transporter--theme',
  promo: promo,
  article: {
    series: [],
    contentType: 'article',
    headline: 'How cultural contexts can shape mental illness',
    tags: '@tags.tags',
    author: '@author',
    mainMedia: [mainMediaPicture],
    bodyParts: [
      standfirst,
      {
        type: 'gif-video',
        weight: 'supporting',
        value: {
          posterImage: gifVideoPoster,
          sources: [{
            url: 'https://video.twimg.com/tweet_video/C_YvyiGXgAA7Arj.mp4',
            fileFormat: 'video/mp4'
          }],
          caption: `Cats, because it's the internet`
        }
      },
      htmlBlock,
      htmlBlock,
      {
        type: 'interview',
        value: '@interview.interview'
      },
      htmlBlock,
      {
        type: 'picture',
        value: smallPicture
      },
      htmlBlock,
      htmlBlock,
      htmlBlock,
      {
        type: 'picture',
        value: standalonePicture
      },
      htmlBlock,
      htmlBlock,
      htmlBlock,
      {
        type: 'video-embed',
        value: {
          name: 'Video name',
          description: 'A description of the video',
          embedUrl: `https://youtube.com/embed/JMzQiwnQ0Bo`
        }
      },
      htmlBlock,
      htmlBlock,
      {
        type: 'imageGallery',
        weight: 'standalone',
        value: {
          name: 'Gallery name',
          items: [smallPicture, largePicture, smallPicture, largePicture, smallPicture, largePicture, smallPicture, largePicture, smallPicture, largePicture]
        }
      },
      htmlBlock,
      {
        type: 'list',
        value: {
          name: 'List name',
          items: ['one', 'two', 'three']
        }
      },
      htmlBlock
    ]
  }
};

export const variants = [
  {
    name: 'digital-story',
    context: {
      seriesNav: '@numbered-list--horizontal',
      article: {
        url: 'lorem-ipsum',
        positionInSeries: 3,
        series: [{
          commissionedLength: 5,
          color: 'purple',
          url: 'a-drop-in-the-ocean'
        }]
      }
    }
  },
  {
    name: 'video',
    context: {
      article: {
        contentType: 'video',
        heading: 'This is a video',
        mainMedia: [{
          type: 'video-embed',
          embedUrl: 'https://youtube.com/embed/JMzQiwnQ0Bo'
        }],
        bodyParts: [
          standfirst,
          htmlBlock
        ]
      }
    }
  },
  {
    name: 'comic',
    context: {
      article: {
        contentType: 'comic',
        headline: 'Demodicid Navigation',
        series: [{
          name: 'Body Squabbles'
        }],
        tags: null,
        mainMedia: [{
          contentUrl: 'https://placehold.it/900x900',
          type: 'picture',
          alt: 'Lorem ipsum dolor sit amet',
          width: 900,
          height: 900
        }],
        bodyParts: [
          standfirst,
          htmlBlock
        ]
      }
    }
  }
];
