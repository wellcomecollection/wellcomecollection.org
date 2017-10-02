import type {ImagePromo, ImageList, Contributor} from '../content-model/content-blocks';
import type {Article} from '../model/article';
import type {Picture} from '../model/picture';
import Prismic from 'prismic-javascript';
import {List} from 'immutable';
import {RichText, Date as PrismicDate} from 'prismic-dom';
import {prismicApi, prismicPreviewApi} from './prismic-api';
import {isEmptyObj} from '../util/is-empty-obj';

function getSeries(doc) {
  return doc.data.series.map(seriesGroup => {
    const series = seriesGroup.series;
    return series && series.data && {
      id: series.id,
      name: series.data.name,
      description: series.data.description
    };
  }).filter(_ => _);
}

export function getContributors(doc): Array<Contributor> {
  // TODO: Support creator's role
  return doc.data.contributors
    .filter(creator => creator.slice_type === 'person')
    .map(slice => {
      const personData = slice.primary.person && slice.primary.person.data;
      const roleData = slice.primary.role && slice.primary.role.data;
      const role = roleData && {
        title: roleData && asText(roleData.title)
      };
      const person = personData && {
        name: personData.name,
        twitterHandle: personData.twitterHandle,
        image: personData.image && personData.image.url,
        description: asText(personData.description)
      };

      return {person, role};
    });
}

export function getPublishedDate(doc) {
  // This is because we need to have a separeate `publishDate` for articles imported from WP
  return PrismicDate(doc.data.publishDate || doc.first_publication_date || Date.now());
}

export function getPromo(doc): ?ImagePromo {
  const maybePromo = doc.data.promo.find(slice => slice.slice_type === 'editorialImage');
  return maybePromo && ({
    text: asText(maybePromo.primary.caption),
    media: prismicImageToPicture({image: maybePromo.primary.image})
  }: ImagePromo);
}

export function getFeaturedMediaFromBody(doc): ?(Picture | ImageList) {
  return List(doc.data.body.filter(slice => slice.slice_label === 'featured')
    .map(slice => {
      switch (slice.slice_type) {
        case 'editorialImage': return prismicImageToPicture(slice.primary);
        case 'imageList': return convertPrismicImageList(slice);
      }
    })).first();
}

export function prismicImageToPicture(captionedImage) {
  const image = isEmptyObj(captionedImage.image) ? null : captionedImage.image;
  const tasl = image && image.copyright && getTaslFromCopyright(image.copyright);

  return ({
    type: 'picture',
    contentUrl: image && image.url,
    width: image && image.dimensions.width,
    height: image && image.dimensions.height,
    caption: captionedImage.caption && captionedImage.caption.length !== 0 && asHtml(captionedImage.caption),
    alt: image && image.alt,
    title: tasl && tasl.title,
    author: tasl && tasl.author,
    source: {
      name: tasl && tasl.sourceName,
      link: tasl && tasl.sourceLink
    },
    license: tasl && tasl.license,
    copyright: {
      holder: tasl && tasl.copyrightHolder,
      link: tasl && tasl.copyrightLink
    }
  }: Picture);
}

function convertPrismicImageList(slice): ImageList {
  return ({
    // TODO: We need to move things to using block types
    type: 'image-lists',
    blockType: 'image-lists',
    description: asText(slice.primary.description),
    items: slice.items.map(item => {
      const image = prismicImageToPicture(item);
      const description = RichText.asHtml(item.description);
      const title = asText(item.title);
      const subtitle = asText(item.subtitle);
      return { title, subtitle, image, description };
    })
  }: ImageList);
}

function getTaslFromCopyright(copyright) {
  // We expect a string of title|author|sourceName|sourceLink|license|copyrightHolder|copyrightLink
  // e.g. Self|Rob Bidder|||CC-BY-NC
  const list = copyright.split('|');
  const v = list
    .concat(Array(7 - list.length))
    .map(v => !v.trim() ? null : v.trim());

  const [title, author, sourceName, sourceLink, license, copyrightHolder, copyrightLink] = v;

  return {title, author, sourceName, sourceLink, license, copyrightHolder, copyrightLink};
}

export async function getArticle(id: string, previewReq: ?Request) {
  const prismic = previewReq ? await prismicPreviewApi(previewReq) : await prismicApi();

  const fetchLinks = [
    'people.name', 'people.image', 'people.twitterHandle', 'people.description',
    'books.title', 'books.title', 'books.author', 'books.isbn', 'books.publisher', 'books.link', 'books.cover',
    'series.name', 'series.description', 'series.color', 'series.commissionedLength',
    'editorial-contributor-roles.title', 'event-contributor-roles'
  ];

  const articles = await prismic.query([
    Prismic.Predicates.at('document.id', id),
    Prismic.Predicates.any('document.type', ['articles', 'webcomics'])
  ], {fetchLinks});
  const prismicDoc = articles.total_results_size === 1 ? articles.results[0] : null;

  if (!prismicDoc) {
    return null;
  }

  switch (prismicDoc.type) {
    case 'articles': return parseArticleAsArticle(prismicDoc);
    case 'webcomics': return parseWebcomicAsArticle(prismicDoc);
  }
}

function parseArticleAsArticle(prismicArticle) {
  // TODO : construct this not from strings
  const url = `/articles/${prismicArticle.id}`;

  // We fallback to `Date.now()` in case we're in preview and don't have a published date
  const publishDate = getPublishedDate(prismicArticle);

  const featuredMedia = getFeaturedMediaFromBody(prismicArticle);

  // TODO: Don't convert this into thumbnail
  const promo = prismicArticle.data.promo.find(slice => slice.slice_type === 'editorialImage');
  const thumbnail = promo && prismicImageToPicture(promo.primary);
  const description = promo && asText(promo.primary.caption); // TODO: Do not use description
  const contributors = getContributors(prismicArticle);
  const series = getSeries(prismicArticle);

  const bodyParts = convertContentToBodyParts(prismicArticle.data.body);

  const article: Article = {
    contentType: 'article',
    headline: asText(prismicArticle.data.title),
    url: url,
    datePublished: publishDate,
    thumbnail: thumbnail,
    author: contributors,
    series: series,
    bodyParts: bodyParts,
    mainMedia: [featuredMedia],
    description: description
  };

  return article;
}

export function convertContentToBodyParts(content) {
  // TODO: Add these as ContentBlocks when the model is in
  return content.filter(slice => slice.slice_label !== 'featured').map(slice => {
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
            title: asText(slice.primary.title),
            items: slice.items.map(prismicImageToPicture)
          }
        };

      case 'imageList':
        return {
          weight: 'default',
          type: 'imageList',
          value: convertPrismicImageList(slice)
        };

      case 'quote':
        // TODO: Support citation link
        return {
          type: 'quote',
          weight: 'default',
          value: {
            body: RichText.asHtml(slice.primary.quote),
            footer: slice.primary.citation && slice.primary.source ? `${slice.primary.citation} - ${slice.primary.source}` : null,
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

      case 'iframeSrc':
        return {
          type: 'iframe',
          value: {
            src: slice.value
          }
        };

      default:
        break;
    }
  }).filter(_ => _);
}

type PaginatedResults = {|
  currentPage: number,
  results: List<Articles>,
  pageSize: number,
  totalResults: number,
  totalPages: number
|};

export async function getArticleList(page = 1, {pageSize = 10, predicates = []} = {}) {
  const fetchLinks = [
    'people.name', 'people.image', 'people.twitterHandle', 'people.description',
    'series.name', 'series.description', 'series.color', 'series.commissionedLength'
  ];
  // TODO: This order is not really doing what we expect it to do.
  const orderings = '[document.first_publication_date desc, my.articles.publishDate desc, my.webcomics.publishDate desc]';
  const prismic = await prismicApi();
  const articlesList = await prismic.query([
    Prismic.Predicates.any('document.type', ['articles', 'webcomics']),
    Prismic.Predicates.not('document.tags', ['delist'])
  ].concat(predicates), {fetchLinks, page, pageSize, orderings});

  const articlesAsArticles = articlesList.results.map(result => {
    switch (result.type) {
      case 'articles': return parseArticleAsArticle(result);
      case 'webcomics': return parseWebcomicAsArticle(result);
    }
  });

  // This shape matches the works API
  return ({
    currentPage: page,
    results: articlesAsArticles,
    pageSize: articlesList.results_per_page,
    totalResults: articlesList.total_results_size,
    totalPages: articlesList.total_pages
  }: PaginatedResults);
}

export async function getSeriesArticles(id: string, page = 1) {
  const paginatedResults = await getArticleList(page, {predicates: [Prismic.Predicates.at('my.articles.series.series', id)]});

  if (paginatedResults.totalResults > 0) {
    const series = paginatedResults.results[0].series[0];
    return {series, paginatedResults};
  }
}

export function asText(maybeContent) {
  return maybeContent && RichText.asText(maybeContent).trim();
}

export function asHtml(maybeContent) {
  return maybeContent && RichText.asHtml(maybeContent).trim();
}

// TODO: There's some abstracting to do here
function parseWebcomicAsArticle(prismicDoc) {
  // TODO : construct this not from strings
  const url = `/articles/${prismicDoc.id}`;

  // TODO: potentially get rid of this
  const publishDate = getPublishedDate(prismicDoc);
  const mainMedia = [prismicImageToPicture({ image: prismicDoc.data.image })];

  // TODO: Don't convert this into thumbnail
  const promo = prismicDoc.data.promo.find(slice => slice.slice_type === 'editorialImage');
  const thumbnail = promo && prismicImageToPicture(promo.primary);
  const description = asText(promo.primary.caption); // TODO: Do not use description
  const contributors = getContributors(prismicDoc);
  const series = getSeries(prismicDoc);

  const article: Article = {
    contentType: 'comic',
    headline: asText(prismicDoc.data.title),
    url: url,
    datePublished: publishDate,
    thumbnail: thumbnail,
    author: contributors,
    series: series,
    bodyParts: [],
    mainMedia: mainMedia,
    description: description
  };

  return article;
}
