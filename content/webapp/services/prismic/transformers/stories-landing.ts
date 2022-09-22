import { isNotUndefined } from '@weco/common/utils/array';
import { StoriesLandingPrismicDocument } from '../types/stories-landing';
import { StoriesLanding } from '../../../types/stories-landing';
import { transformBook, transformBookToBookBasic } from '../transformers/books';
import {
  transformSeries,
  transformSeriesToSeriesBasic,
} from '../transformers/series';
import {
  transformArticle,
  transformArticleToArticleBasic,
} from '../transformers/articles';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
import { asRichText, asText } from '.';

function transformStoryOrSeries(storyOrSeries) {
  if (storyOrSeries.type === 'articles') {
    return transformArticleToArticleBasic(transformArticle(storyOrSeries));
  } else {
    return transformSeriesToSeriesBasic(transformSeries(storyOrSeries));
  }
}
export function transformStoriesLanding(
  storiesLandingDoc: StoriesLandingPrismicDocument
): StoriesLanding {
  const {
    introText,
    storiesTitle,
    storiesDescription,
    stories,
    booksTitle,
    booksDescription,
    books,
  } = storiesLandingDoc.data;
  return {
    introText: asRichText(introText) || [],
    storiesTitle: asText(storiesTitle),
    storiesDescription: asRichText(storiesDescription) || [],
    stories: stories
      ?.map(d =>
        isFilledLinkToDocumentWithData(d.story)
          ? transformStoryOrSeries(d.story)
          : undefined
      )
      .filter(isNotUndefined),
    booksTitle: asText(booksTitle),
    booksDescription: asRichText(booksDescription) || [],
    books: books
      ?.map(d =>
        isFilledLinkToDocumentWithData(d.book)
          ? transformBookToBookBasic(transformBook(d.book))
          : undefined
      )
      .filter(isNotUndefined),
  };
}
