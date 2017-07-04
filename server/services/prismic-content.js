import type {Article} from '../model/article';
import type {Picture} from '../model/picture';
import Prismic from 'prismic-javascript';
import {RichText, Date as PrismicDate} from 'prismic-dom';
import {prismicApi, prismicPreviewApi} from './prismic-api';

export async function getEditorialPreview(id: string, req) {
  const prismic = await prismicPreviewApi(req);
  return getEditorialAsArticle(prismic, id);
}

export async function getEditorial(id: string) {
  const prismic = await prismicApi();
  return getEditorialAsArticle(prismic, id);
}

async function getEditorialAsArticle(prismic, id: string) {
  const fetchLinks = [
    'people.name', 'people.image', 'people.twitterHandle', 'people.description',
    'books.title', 'books.title', 'books.author', 'books.isbn', 'books.publisher', 'books.link', 'books.cover',
    'series.name', 'series.description', 'series.color', 'series.commissionedLength'
  ];
  const articles = await prismic.query([
    Prismic.Predicates.at('document.id', id),
    Prismic.Predicates.at('document.type', 'editorial')
  ], {fetchLinks});
  const prismicArticle = articles.total_results_size === 1 ? articles.results[0] : null;

  if (!prismicArticle) {
    return null;
  }

  return parseEditorialAsArticle(prismicArticle);
}

function parseEditorialAsArticle(prismicArticle) {
  // TODO : construct this not from strings
  const url = `/editorial/${prismicArticle.id}`;

  // TODO: Add this to the article content
  // TODO: potentially get rid of this
  const publishDate = PrismicDate(prismicArticle.data.publishDate || prismicArticle.first_publication_date);

  // TODO:
  const mainMedia = prismicArticle.data.content.filter(slice => slice.primary.weight === 'featured').map(slice => {
    return prismicImageToPicture(slice.primary);
  });

  // TODO: Don't convert this into thumbnail
  const promo = prismicArticle.data.promo.find(slice => slice.slice_type === 'editorialImage');
  const thumbnail = promo && prismicImageToPicture(promo.primary);
  const description = asText(promo.primary.caption); // TODO: Do not use description

  // TODO: Support more than 1 author
  // TODO: Support creator's role
  const creator = prismicArticle.data.contributors.find(creator => creator.slice_type === 'person');
  const person = creator && creator.primary.person.data;
  const author = person && {
    name: person.name,
    twitterHandle: person.twitterHandle,
    image: person.image.url,
    description: asText(person.description)
  };

  const series = prismicArticle.data.series.length > 0 && prismicArticle.data.series.map(prismicSeries => {
    const seriesData = prismicSeries.primary.series.data;
    // TODO: Support commissionedLength and positionInSeries
    return {
      name: seriesData.name,
      description: seriesData.description
    };
  });

  const bodyParts = prismicArticle.data.content.map(slice => {
    switch (slice.slice_type) {
      case 'standfirst':
        return {
          type: 'standfirst',
          weight: 'default',
          value: RichText.asHtml(slice.primary.text)
        };

      case 'text':
        return {
          type: 'text',
          weight: 'default',
          value: RichText.asHtml(slice.primary.text)
        };

      case 'editorialImage':
        // TODO: This shouldn't really be here
        if (slice.primary.weight === 'featured') return;
        return {
          weight: slice.primary.weight,
          type: 'picture',
          value: prismicImageToPicture(slice.primary)
        };

      case 'editorialImageGallery':
        // TODO: add support for ~title~ & description / caption
        return {
          type: 'imageGallery',
          weight: 'standalone',
          value: {
            name: asText(slice.primary.heading),
            items: slice.items.map(prismicImageToPicture)
          }
        };

      case 'quote':
        // TODO: Support citation link
        return {
          type: 'quote',
          weight: 'default',
          value: {
            body: RichText.asHtml(slice.primary.quote),
            footer: `<footer class="quote__footer"><cite class="quote__cite">${slice.primary.citation} - ${slice.primary.source}</cite></footer>`,
            quote: RichText.asHtml(slice.primary.quote),
            citation: `${slice.primary.citation} - ${slice.primary.source}`
          }
        };

      case 'excerpt':
        return {
          type: 'pre',
          name: '',
          weight: 'standalone',
          value: asText(slice.primary.content)
        };

      case 'instagramEmbed':
        return {
          type: 'instagramEmbed',
          value: {
            html: slice.primary.embed.html
          }
        };

      case 'twitterEmbed':
        return {
          type: 'tweet',
          value: {
            html: slice.primary.embed.html
          }
        };

      case 'youtubeVideoEmbed':
        // TODO: Not this ;﹏;
        const embedUrl = slice.primary.embed.html.match(/src="([a-zA-Z0-9://.]+)?/)[1];
        return {
          type: 'video-embed',
          value: {
            embedUrl: embedUrl
          }
        };

      default:
        break;
    }
  }).filter(_ => _);

  const article: Article = {
    contentType: 'article',
    headline: asText(prismicArticle.data.title),
    url: url,
    datePublished: publishDate,
    thumbnail: thumbnail,
    author: author,
    series: series,
    bodyParts: bodyParts,
    mainMedia: mainMedia,
    description: description
  };

  return article;
}

const prismicImageUri = 'https://prismic-io.s3.amazonaws.com/wellcomecollection';
const imgIxUri = 'https://wellcomecollection-prismic.imgix.net';

function convertPrismicToImgIxUri(uri) {
  return uri.replace(prismicImageUri, imgIxUri);
}

function prismicImageToPicture(prismicImage) {
  return ({
    type: 'picture',
    contentUrl: convertPrismicToImgIxUri(prismicImage.image.url), // TODO: Send this through the img.wc.org
    width: prismicImage.image.dimensions.width,
    height: prismicImage.image.dimensions.height,
    caption: asText(prismicImage.caption), // TODO: Support HTML
    alt: prismicImage.image.alt,
    copyrightHolder: prismicImage.image.copyright
  }: Picture);
}

export async function getEditorialList() {
  const fetchLinks = [
    'series.name', 'series.description', 'series.color', 'series.commissionedLength'
  ];
  const prismic = await prismicApi();
  const editorialList = await prismic.query([
    Prismic.Predicates.at('document.type', 'editorial')
  ], {fetchLinks});

  const editorialAsArticles = editorialList.results.map(parseEditorialAsArticle);
  return editorialAsArticles;
}

function asText(maybeContent) {
  return maybeContent && RichText.asText(maybeContent);
}
