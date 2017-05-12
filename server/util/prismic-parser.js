import type {Article} from '../model/article';
import type {Picture} from '../model/picture';
import type {Person} from '../model/person';

const noop = () => {};
const deP = s => s.replace(/<\/?p>/g, '');
const deBr = s => s.replace(/<br>/g, '');
const deN = s => s.replace(/\n/g, '');
const deSpan = s => s.replace(/<\/?span>/g, '');
const bodyPartTypeToParser = {
  html: convertParagraph,
  standfirst: noop,
  heading: convertHeading,
  picture: convertImage,
  video: convertVideo,
  wpVideo: noop,
  list: convertList,
  tweet: convertTweet,
  instagramEmbed: convertInstagram,
  imageGallery: convertImageGallery,
  quote: convertQuote
};

function convertParagraph(value, weight) {
  return {
    key: 'paragraph',
    value: {
      'non-repeat': {
        text: [{
          type: 'paragraph',
          content: {
            text: deP(value),
            spans: []
          }
        }]
      }
    }
  };
}

function convertHeading(value, weight) {
  return {
    key: 'heading',
    value: {
      'non-repeat': {
        heading: value.value
      }
    }
  };
}

function convertImage(value, weight) {
  return {
    key: 'embeddedImage',
    value: {
      'non-repeat': Object.assign({}, createPrismicImageWithCaption(value), {weight})
    }
  };
}

function convertImageGallery(value, weight) {
  const items = value.items.map(item => {
    return createPrismicImageWithCaption(item);
  });
  return {
    key: 'embeddedImageGallery',
    value: {
      repeat: items
    }
  }
}

function convertQuote(value, weight) {
  const quoteText = value.quote || value.body;
  return {
    key: 'quote',
    value: {
      'non-repeat': {
        quote: [{
          type: 'paragraph',
          content: {
            text: deSpan(deBr(deP(quoteText))),
            spans: []
          }
        }],
        source: [{
          type: "paragraph",
          content: {
            text: value.citation ? deSpan(deBr(deP(value.citation))) : null,
            spans: []
          }
        }],
        citation: value.citation
      }
    }
  }
}

function createPrismicImageWithCaption(image: Picture) {
  return {
    caption: [{
      type: 'paragraph',
      content: {
        text: image.caption ? deN(deP(image.caption)) : '',
        spans: []
      }
    }],
    image: {
      origin: {
        // id : '',
        url: image.contentUrl,
        width: image.width,
        height: image.height
      },
      width: image.width,
      height: image.height,
      url: image.contentUrl,
      edit: {
        background: "transparent",
        zoom: 1.0,
        crop: {
          x: 0,
          y: 0
        }
      },
      credits: image.copyrightHolder,
      alt: image.alt,
      thumbnails: {}
    }
  };
}

function convertVideo(value, weight) {
  const ytId = value.embedUrl.match(/embed\/([^?].*)\?/);

  return {
    key: 'youtubeVideo',
    value: {
      'non-repeat': {
        weight,
        embed: {
          type: 'video',
          embed_url: `https://youtube.com/watch?v=${ytId[1]}`
        }
      }
    }
  };
}

function convertInstagram(value, weight) {
  const instagramId = value.html.match(/https:\/\/www\.instagram\.com\/p\/(\d+|\w+)/)[1];
  return {
    key: 'instagramEmbed',
    value: {
      'non-repeat': {
        weight,
        embed: {
          type: 'video',
          embed_url: `https://www.instagram.com/p/${instagramId}/`
        }
      }
    }
  };
}

function convertTweet(value, weight) {
  const twitterMatch = value.html.match(/https:\/\/twitter\.com\/\d+|\w+\/status\/\d+/)[0];
  return {
    key: 'twitterEmbed',
    value: {
      'non-repeat': {
        weight,
          embed: {
          type: 'video',
          embed_url: `https://twitter.com/${twitterMatch}`
        }
      }
    }
  };
}

function convertPromo(image, text) {
  const newImage = Object.assign({}, image, {caption: text});
  return {
    key: 'embeddedImage',
    value: {
      'non-repeat': createPrismicImageWithCaption(newImage)
    }
  }
}

function convertAuthor(author: Person) {
  return {
    key: 'person',
    value: {
      'non-repeat': {
        role: "author",
          person: {
            id: author.prismicId,
            mask: 'people'
        }
      }
    }
  };
}

function convertList(value, weight) {
  const listItems = value.items.map(item => {
    return {
      listItem: [{
        type: "paragraph",
        content: {
          text: item,
          spans: []
        }
      }]
    };
  });

  return {
    key: 'list',
    value: {
      repeat: listItems,
      'non-repeat': {
        'description': [{
          type: 'paragraph',
          content: {
            text: '',
            spans: []
          }
        }]
      }
    }
  }
}

export function prismicParser(slug: string, article: Article) {

  const standfirst = article.bodyParts.find(part => part.type === 'standfirst');

  const mainMediaVideo = article.mainMedia.find(media => media.type === 'video');
  const mainMediaImage = article.mainMedia.find(media => media.type === 'picture');
  const mainMedia = mainMediaVideo ? convertVideo(mainMediaVideo, 'featured') : (mainMediaImage ? convertImage(mainMediaImage, 'featured') : null);

  const promoImage = mainMediaVideo ? mainMediaImage : article.thumbnail;
  const promo = convertPromo(promoImage, article.description);

  const credits = article.author ? [convertAuthor(article.author)] : [];

  const content = article.bodyParts.map(part => {
    const parser = bodyPartTypeToParser[part.type];
    const value = parser(part.value, part.weight);
    return value;
  }).filter(_ => _);

  return {
    type: 'articles',
    tags: ['articles'],
    uid: slug,
    headline: article.headline,
    standfirst: standfirst ? deSpan(deP(standfirst.value)) : '',
    publishDate: article.datePublished,
    promo: [promo],
    credits: credits,
    series: [], // TODO
    content: [mainMedia].filter(_ => _).concat(content)
  };
}
