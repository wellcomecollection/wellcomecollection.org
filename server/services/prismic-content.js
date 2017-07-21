import type {Article} from '../model/article';
import type {Picture} from '../model/picture';
import Prismic from 'prismic-javascript';
import {RichText, Date as PrismicDate} from 'prismic-dom';
import {prismicApi, prismicPreviewApi} from './prismic-api';
import moment from 'moment';

export async function getArticlePreview(id: string, req) {
  const prismic = await prismicPreviewApi(req);
  return getArticleAsArticle(prismic, id);
}

export async function getArticle(id: string) {
  const prismic = await prismicApi();

  return getArticleAsArticle(prismic, id);
}

async function getArticleAsArticle(prismic, id: string) {
  const fetchLinks = [
    'people.name', 'people.image', 'people.twitterHandle', 'people.description',
    'books.title', 'books.title', 'books.author', 'books.isbn', 'books.publisher', 'books.link', 'books.cover',
    'series.name', 'series.description', 'series.color', 'series.commissionedLength'
  ];

  const articles = await prismic.query([
    Prismic.Predicates.at('document.id', id)
    // This should be here, but Prismic is borked, and I need this to work now.
    // TODO: Put this back once Prismic are on it.
    // Prismic.Predicates.any('document.type', ['article', 'events'])
  ], {fetchLinks});
  const prismicArticle = articles.total_results_size === 1 ? articles.results[0] : null;

  if (!prismicArticle) {
    return null;
  }

  return parseArticleAsArticle(prismicArticle);
}

function parseArticleAsArticle(prismicArticle) {
  // TODO : construct this not from strings
  const url = `/articles/${prismicArticle.id}`;

  // We fallback to `Date.now()` in case we're in preview and don't have a published date
  const publishDate = PrismicDate(prismicArticle.data.publishDate || prismicArticle.first_publication_date || Date.now());

  // TODO:
  const mainMedia = prismicArticle.data.body.filter(slice => slice.slice_label === 'featured').map(slice => {
    return prismicImageToPicture(slice.primary);
  });

  // TODO: Don't convert this into thumbnail
  const promo = prismicArticle.data.promo.find(slice => slice.slice_type === 'editorialImage');
  const thumbnail = promo && prismicImageToPicture(promo.primary);
  const description = promo && asText(promo.primary.caption); // TODO: Do not use description

  // TODO: Support creator's role
  const authors = prismicArticle.data.contributors
    .filter(creator => creator.slice_type === 'person')
    .map(slice => slice.primary.person.data)
    .map(person => {
      return {
        name: person.name,
        twitterHandle: person.twitterHandle,
        image: person.image && person.image.url,
        description: asText(person.description)
      };
    });

  const series = prismicArticle.data.series.length > 0 && prismicArticle.data.series.map(prismicSeries => {
    const seriesData = prismicSeries.primary.series.data;
    // TODO: Support commissionedLength and positionInSeries
    return {
      name: seriesData.name,
      description: seriesData.description
    };
  });

  const bodyParts = convertContentToBodyParts(prismicArticle.data.body);

  const article: Article = {
    contentType: 'article',
    headline: asText(prismicArticle.data.title),
    url: url,
    datePublished: publishDate,
    thumbnail: thumbnail,
    author: authors,
    series: series,
    bodyParts: bodyParts,
    mainMedia: mainMedia,
    description: description
  };

  return article;
}

function convertContentToBodyParts(content) {
  return content.map(slice => {
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
        if (slice.slice_label === 'featured') return;
        return {
          weight: slice.slice_label,
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
            footer: `${slice.primary.citation} - ${slice.primary.source}`,
            quote: RichText.asHtml(slice.primary.quote),
            citation: `${slice.primary.citation} - ${slice.primary.source}`
          }
        };

      case 'excerpt':
        return {
          type: 'pre',
          name: '',
          weight: 'standalone',
          value: asText(slice.primary.body)
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

      case 'schedule':
        // TODO: Not this ;﹏;
        const schedule = slice.items.map(item => ({
          when: `${moment(item.start).format('HH:mm')} – ${moment(item.end).format('HH:mm')}`,
          what: asText(item.what)
        }));

        return {
          type: 'schedule',
          value: schedule
        };

      default:
        break;
    }
  }).filter(_ => _);
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
    caption: prismicImage.caption && prismicImage.caption.length !== 0 && asText(prismicImage.caption), // TODO: Support HTML
    alt: prismicImage.image.alt,
    copyrightHolder: prismicImage.image.copyright
  }: Picture);
}

export async function getArticleList() {
  const fetchLinks = [
    'series.name', 'series.description', 'series.color', 'series.commissionedLength'
  ];
  const prismic = await prismicApi();
  const articlesList = await prismic.query([
    Prismic.Predicates.any('document.type', ['articles', 'webcomics'])
  ], {fetchLinks});

  const articlesAsArticles = articlesList.results.map(result => {
    switch (result.type) {
      case 'articles': return parseArticleAsArticle(result);
      case 'webcomics': return parseWebcomicAsArticle(result);
    }
  });
  return articlesAsArticles;
}

function asText(maybeContent) {
  return maybeContent && RichText.asText(maybeContent).trim();
}

export async function getEvent(id) {
  const prismic = await prismicApi();
  const fetchLinks = [
    'people.name', 'people.image', 'people.twitterHandle', 'people.description',
    'access-statements.title', 'access-statements.description'
  ];
  const events = await prismic.query(Prismic.Predicates.at('document.id', id), {fetchLinks});
  const event = events.total_results_size === 1 ? events.results[0] : null;

  if (!event) {
    return null;
  }
  const promo = event.data.promo.find(slice => slice.slice_type === 'editorialImage');
  const thumbnail = promo && prismicImageToPicture(promo.primary);

  const contributors = event.data.contributors.filter(contrib => contrib.slice_type === 'person').map(contrib => {
    return {
      name: contrib.primary.person.data.name,
      twitterHandle: contrib.primary.person.data.twitterHandle,
      image: contrib.primary.person.data.image && contrib.image.url,
      description: RichText.asText(contrib.primary.person.data.description)
    };
  });
  const article: Article = {
    contentType: 'article',
    headline: asText(event.data.title),
    url: '',
    datePublished: PrismicDate(event.data.startDate),
    thumbnail: thumbnail,
    author: null, // We don't want author
    bodyParts: convertContentToBodyParts(event.data.body),
    mainMedia: [thumbnail],
    series: [],

    // Not part of the standard model
    when: event.data.when.map(slice =>
      `${moment(slice.primary.start).format('dddd MM MMMM YYYY HH:mm')} – ${moment(slice.primary.end).format('HH:mm')}`
    ),
    eventbriteId: event.data.eventbriteId,
    eventFormat: event.data.format,
    accessStatements: event.data.accessStatements.map(accessStatement => {
      return {
        title: asText(accessStatement.value.data.title),
        description: RichText.asHtml(accessStatement.value.data.description)
      };
    }),
    contributors: contributors
  };

  return article;
}

export async function getWebcomic(id) {
  const prismic = await prismicApi();
  const fetchLinks = [
    'people.name', 'people.image', 'people.twitterHandle', 'people.description',
    'access-statements.title', 'access-statements.description',
    'series.name', 'series.description', 'series.color', 'series.commissionedLength'
  ];
  const webcomics = await prismic.query(Prismic.Predicates.at('document.id', id), {fetchLinks});
  const webcomic = webcomics.total_results_size === 1 ? webcomics.results[0] : null;

  return parseWebcomicAsArticle(webcomic);
}

// TODO: There's some abstracting to do here
function parseWebcomicAsArticle(prismicDoc) {
  // TODO : construct this not from strings
  const url = `/webcomics/${prismicDoc.id}`;

  // TODO: potentially get rid of this
  const publishDate = PrismicDate(prismicDoc.data.publishDate || prismicDoc.first_publication_date);
  const mainMedia = [prismicImageToPicture({ image: prismicDoc.data.image })];

  // TODO: Don't convert this into thumbnail
  const promo = prismicDoc.data.promo.find(slice => slice.slice_type === 'editorialImage');
  const thumbnail = promo && prismicImageToPicture(promo.primary);
  const description = asText(promo.primary.caption); // TODO: Do not use description

  // TODO: Support more than 1 author
  // TODO: Support creator's role
  const creator = prismicDoc.data.contributors.find(creator => creator.slice_type === 'person');
  const person = creator && creator.primary.person.data;
  const author = person && {
    name: person.name,
    twitterHandle: person.twitterHandle,
    image: person.image.url,
    description: asText(person.description)
  };

  const series = prismicDoc.data.series.length > 0 && prismicDoc.data.series.map(prismicSeries => {
    const seriesData = prismicSeries.primary.series.data;
    return {
      name: seriesData.name,
      description: seriesData.description
    };
  });

  const article: Article = {
    contentType: 'comic',
    headline: asText(prismicDoc.data.title),
    url: url,
    datePublished: publishDate,
    thumbnail: thumbnail,
    author: author,
    series: series,
    bodyParts: [],
    mainMedia: mainMedia,
    description: description
  };

  return article;
}
