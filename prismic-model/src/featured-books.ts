import link from './parts/link';
import list from './parts/list';
import { CustomType } from './types/CustomType';

const featuredBooks: CustomType = {
  id: 'featured-books',
  label: 'Featured books',
  repeatable: false,
  status: true,
  json: {
    'Featured books': {
      books: list('books', link('book', 'document', ['books'], 'book')),
    },
  },
};

export default featuredBooks;
