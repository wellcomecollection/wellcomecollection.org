import Prismic from 'prismic.io';

// TODO: DMC commented this because it wasn't being used
// function removeParagraphs(string) {
//   return string.replace(/<\/?p>/g, '');
// }

function convertPrismicImageToPicture(image) {
  return {
    type: 'picture',
    contentUrl: image.url,
    width: image.width,
    height: image.height,
    alt: image.alt,
    copyright: image.copyright
  };
}

export async function getItem(id) {
  const options = {'fetchLinks': ['author.givenName', 'author.familyName', 'author.biography', 'author.twitterHandle']};
  const api = await Prismic.api('http://wellcomecollection.prismic.io/api');
  const item = await api.getByID(id, options);
  const authorItem = item.getSliceZone('article.author').slices.find(a => a);
  const author = authorItem ? {
    givenName: authorItem.value.getText('author.givenName'),
    familyName: authorItem.value.getText('author.familyName'),
    twitterHandle: authorItem.value.getText('author.twitterHandle'),
    description: authorItem.value.getText('author.biography'),
    name: `${authorItem.value.getText('author.givenName')} ${authorItem.value.getText('author.familyName')}`
  } : null;

  const mainMedia = item.getSliceZone('article.mainMedia').slices.map(slice => {
    switch (slice.sliceType) {
      case 'embeddedImage':
        const images = slice.value.toArray().map(embeddedImage => {
          const image = embeddedImage.getImage('asset');
          // TODO: DMC commented this because it wasn't being used
          // const maybeCaption = removeParagraphs(embeddedImage.getStructuredText('caption').asHtml());
          // const caption = maybeCaption !== '' ? maybeCaption : null;
          return convertPrismicImageToPicture(image);
        });
        return images;

      case 'youtubeVideo':
        // TODO
        return [];

      default:
        return [];
    }
  }).reduce((flattened, toFlatten) => flattened.concat(toFlatten));

  const promoMedia = item.getSliceZone('article.promoMedia').slices.map(slice => {
    switch (slice.sliceType) {
      case 'embeddedImage':
        const image = slice.value;
        return convertPrismicImageToPicture(image);

      default:
        return [];
    }
  });

  return {
    contentType: 'comic',
    url: `/articles/prismic/${id}`,
    headline: item.getText('article.headline'),
    standfirst: item.getText('article.standfirst'),
    description: item.getText('article.promoText'),
    datePublished: new Date(item.getTimestamp('article.publishDate')),
    mainMedia: mainMedia,
    thumbnail: promoMedia.length !== 0 ? promoMedia[0] : null,
    bodyParts: [],
    series: [],
    author
  };
}
