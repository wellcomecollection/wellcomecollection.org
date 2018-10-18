// @flow
import Prismic from 'prismic-javascript';
import {getDocument, getDocuments} from './api';
import {
  parseGenericFields,
  parseTimestamp,
  asHtml,
  asText,
  parsePromoToCaptionedImage
} from './parsers';
import {
  contributorsFields,
  peopleFields,
  organisationsFields
} from './fetch-links';
import type {Book} from '../../model/books';
import type {PrismicDocument, PrismicQueryOpts, PaginatedResults} from './types';

export function parseBook(document: PrismicDocument): Book {
  const data = document.data;
  const genericFields = parseGenericFields(document);
  // We do this over the general parser as we want the not 16:9 image.
  const cover = data.promo && (data.promo.length > 0 ? parsePromoToCaptionedImage(data.promo, null) : null);
  return {
    type: 'books',
    ...genericFields,
    subtitle: data.subtitle && asText(data.subtitle),
    orderLink: data.orderLink && data.orderLink.url,
    price: data.price,
    format: data.format,
    extent: data.extent,
    isbn: data.isbn,
    reviews: data.reviews && data.reviews.map(review => {
      return {
        text: review.text && asHtml(review.text),
        citation: review.citation && asHtml(review.citation)
      };
    }),
    datePublished: data.datePublished && parseTimestamp(data.datePublished),
    authorName: data.authorName && asText(data.authorName),
    authorImage: data.authorImage && data.authorImage.url,
    authorDescription: data.authorDescription,
    cover: cover && cover.image
  };
}

export async function getBook(req: ?Request, id: string): Promise<?Book> {
  const document = await getDocument(req, id, {
    fetchLinks: contributorsFields.concat(peopleFields, organisationsFields)
  });

  if (document && document.type === 'books') {
    const book = parseBook(document);
    const labels = [{
      url: null,
      text: 'Book'
    }];
    return {...book, labels};
  }
}

type ArticleQueryProps = {|
  predicates?: Prismic.Predicates[],
  ...PrismicQueryOpts
|}

export async function getBooks(req: ?Request, {
  predicates = [],
  ...opts
}: ArticleQueryProps): Promise<PaginatedResults<Book>> {
  const orderings = '[my.books.datePublished desc, document.first_publication_date desc]';
  const paginatedResults = await getDocuments(req, [
    Prismic.Predicates.any('document.type', ['books'])
  ].concat(predicates), {
    orderings,
    ...opts
  });

  const books = paginatedResults.results.map(doc => {
    return parseBook(doc);
  });

  return {
    currentPage: paginatedResults.currentPage,
    pageSize: paginatedResults.pageSize,
    totalResults: paginatedResults.totalResults,
    totalPages: paginatedResults.totalPages,
    results: books
  };
}
