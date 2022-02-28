import { GetServerSidePropsPrismicClient } from '.';
import { FeaturedBooksPrismicDocument } from '../types/books';

const graphQuery = `{
  featured-books {
    books {
      book {
        ...bookFields
      }
    }
  }
}`;

export const fetchFeaturedBooks = ({
  client,
}: GetServerSidePropsPrismicClient): Promise<FeaturedBooksPrismicDocument> => {
  return client.getSingle<FeaturedBooksPrismicDocument>('featured-books', {
    graphQuery,
  });
};
