import { isNotUndefined } from '@weco/common/utils/type-guards';
import { StoriesLandingDocument as RawStoriesLandingDocument } from '@weco/common/prismicio-types';
import { StoriesLanding } from '@weco/content/types/stories-landing';
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
  if (storyOrSeries.type === 'articles' || storyOrSeries.type === 'webcomics') {
    return transformArticleToArticleBasic(transformArticle(storyOrSeries));
  } else {
    return transformSeriesToSeriesBasic(transformSeries(storyOrSeries));
  }
}
export function transformStoriesLanding(
  storiesLandingDoc: RawStoriesLandingDocument
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
    id: storiesLandingDoc.id,
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
