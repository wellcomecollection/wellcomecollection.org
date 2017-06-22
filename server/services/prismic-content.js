import type {Article} from '../model/article';
import type {Picture} from '../model/picture';
import Prismic from 'prismic-javascript';
import {RichText, Date as PrismicDate} from 'prismic-dom';
import {prismicApiV2, prismicPreviewApi} from './prismic-api';

export async function getPreviewContent(id: string, req) {
  const prismic = await prismicPreviewApi(req);
  return getParsedContent(prismic, id);
}

export async function getContent(id: string) {
  const prismic = await prismicApiV2();
  return getParsedContent(prismic, id);
}

export async function getParsedContent(prismic, id: string) {
  const fetchLinks = [
    'people.name', 'people.image', 'people.twitterHandle',
    'books.title', 'books.title', 'books.author', 'books.isbn', 'books.publisher', 'books.link', 'books.cover',
    'series.name', 'series.description', 'series.color', 'series.commissionedLength'
  ];
  const articles = await prismic.query(Prismic.Predicates.at('document.id', id), {fetchLinks});
  const prismicArticle = articles.total_results_size === 1 ? articles.results[0] : null;

  if (!prismicArticle) {
    return null;
  }

  // TODO : construct this not from strings
  const url = `/articles/${id}`;

  // TODO: Leave this in the flow of the body
  // const prismicStandfirst = prismicArticle.data.body.find(slice => slice.slice_type === 'standfirst');
  // const standfirst = prismicStandfirst && RichText.asText(prismicStandfirst.primary.text);

  // TODO: Add this to the article body
  // TODO: potentially get rid of this
  const publishDate = PrismicDate(prismicArticle.data.publishDate || prismicArticle.first_publication_date);

  // TODO:
  const mainMedia = prismicArticle.data.body.filter(slice => slice.primary.weight === 'featured').map(slice => {
    return prismicImageToPicture(slice.primary);
  });

  // TODO: Don't convert this into thumbnail
  const promo = prismicArticle.data.promo.find(slice => slice.slice_type === 'embeddedImage');
  const thumbnail = promo && prismicImageToPicture(promo.primary);

  // TODO: Support more than 1 author
  // TODO: Support creator's role
  // TODO: For some reason person.image isn't coming through
  const creator = prismicArticle.data.creators.find(creator => creator.slice_type === 'person');
  const person = creator && creator.primary.person.data;
  const author = person && {
    name: person.name,
    twitterHandle: person.twitterHandle,
    image: person.image.url
  };

  const series = prismicArticle.data.series.length > 0 && prismicArticle.data.series.map(prismicSeries => {
    const seriesData = prismicSeries.primary.series.data;
    // TODO: Support commissionedLength and positionInSeries
    return {
      name: seriesData.name,
      description: seriesData.description
    };
  });

  const bodyParts = prismicArticle.data.body.map(slice => {
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

      case 'embeddedImage':
        // TODO: This shouldn't really be here
        if (slice.primary.weight === 'featured') return;
        return {
          weight: slice.primary.weight,
          type: 'picture',
          value: prismicImageToPicture(slice.primary)
        };

      case 'embeddedImageGallery':
        // TODO: add support for ~title~ & description / caption
        return {
          type: 'imageGallery',
          weight: 'standalone',
          value: {
            name: RichText.asText(slice.primary.heading),
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
          value: RichText.asText(slice.primary.content)
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
    headline: RichText.asText(prismicArticle.data.headline),
    url: url,
    datePublished: publishDate,
    thumbnail: thumbnail,
    author: author,
    series: series,
    bodyParts: bodyParts,
    mainMedia: mainMedia
  };

  return article;
}

function prismicImageToPicture(prismicImage) {
  return ({
    type: 'picture',
    contentUrl: prismicImage.image.url, // TODO: Send this through the img.wc.org
    width: prismicImage.image.dimensions.width,
    height: prismicImage.image.dimensions.height,
    caption: RichText.asText(prismicImage.caption), // TODO: Support HTML
    alt: prismicImage.image.alt,
    copyrightHolder: prismicImage.image.copyright
  }: Picture);
}
