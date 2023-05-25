import { documentLink } from './parts/link';
import list from './parts/list';
import title from './parts/title';
import { multiLineText } from './parts/text';
import { CustomType } from './types/CustomType';

const featuredBooks: CustomType = {
  id: 'stories-landing',
  label: 'Stories landing',
  repeatable: false,
  status: true,
  json: {
    Main: {
      introText: multiLineText('Introductory text', {
        placeholder: 'This will appear at the top of the stories landing page.',
      }),
    },
    'Featured stories/series': {
      storiesTitle: title,
      storiesDescription: multiLineText('description'),
      stories: list('stories', {
        story: documentLink('story/series', {
          linkedTypes: ['articles', 'series'],
        }),
      }),
    },
    'Featured books': {
      booksTitle: title,
      booksDescription: multiLineText('description'),
      books: list('books', {
        book: documentLink('book', { linkedType: 'books' }),
      }),
    },
  },
  format: 'custom',
};

export default featuredBooks;
