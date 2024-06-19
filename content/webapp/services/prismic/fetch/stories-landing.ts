import { GetServerSidePropsPrismicClient } from '.';
import { StoriesLandingDocument as RawStoriesLandingDocument } from '@weco/common/prismicio-types';

const graphQuery = `{
  stories-landing {
    introText
    storiesTitle
    storiesDescription
    stories {
      story {
        ... on series {
          title
          promo {
            ... on editorialImage {
              non-repeat {
                caption
                image
              }
            }
          }
        }
        ... on webcomics {
          title
          format {
            ... on article-formats {
              title
            }
          }
          promo {
            ... on editorialImage {
              non-repeat {
                caption
                image
              }
            }
          }
          series {
            series {
              title
            }
          }
        }
        ... on articles {
          title
          format {
            ... on article-formats {
              title
            }
          }
          promo {
            ... on editorialImage {
              non-repeat {
                caption
                image
              }
            }
          }
          series {
            series {
              title
            }
          }
        }
      }
    }
    booksTitle
    booksDescription
    books {
      book {
        title
        subtitle
        promo {
          ... on editorialImage {
            non-repeat {
              caption
              image
            }
          }
        }
      }
    }
  }
}`.replace(/\n(\s+)/g, '\n');

export const fetchStoriesLanding = ({
  client,
}: GetServerSidePropsPrismicClient): Promise<RawStoriesLandingDocument> =>
  client.getSingle<RawStoriesLandingDocument>('stories-landing', {
    graphQuery,
  });
