import link from './parts/link';
import list from './parts/list';
import title from './parts/title';
import { multiLineText } from './parts/structured-text';
import { CustomType } from './types/CustomType';

const featuredBooks: CustomType = {
  id: 'stories-landing',
  label: 'Stories landing',
  repeatable: false,
  status: true,
  json: {
    Main: {
      introText: multiLineText({
        label: 'Introductory text',
        placeholder: 'This will appear at the top of the stories landing page.',
      }),
    },
    'Featured stories/series': {
      storiesTitle: title,
      storiesDescription: multiLineText({ label: 'description' }),
      stories: list('stories', {
        story: link('story/series', 'document', ['articles', 'series']),
      }),
    },
    'Featured books': {
      booksTitle: title,
      booksDescription: multiLineText({ label: 'description' }),
      books: list('books', { book: link('book', 'document', ['books']) }),
    },
  },
};

export default featuredBooks;
