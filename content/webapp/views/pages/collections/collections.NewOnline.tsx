import { FunctionComponent } from 'react';

import Space from '@weco/common/views/components/styled/Space';
import type { BookBasic } from '@weco/content/types/books';
import CardGrid from '@weco/content/views/components/CardGrid';

const NewOnline: FunctionComponent = () => {
  // Construct four mock BookBasic items so CardGrid will render BookCard for them.
  const items: BookBasic[] = [
    {
      type: 'books',
      id: 'new-online-book-1',
      uid: 'new-online-book-1',
      title: 'Placeholder Book One',
      subtitle: 'An introduction',
      cover: {
        contentUrl:
          'https://via.placeholder.com/400x600.png?text=Placeholder+Book+1',
        width: 400,
        height: 600,
        alt: 'Placeholder book 1',
      },
      promo: undefined,
      labels: [{ text: 'Book' }],
    },
    {
      type: 'books',
      id: 'new-online-book-2',
      uid: 'new-online-book-2',
      title: 'Placeholder Book Two',
      subtitle: 'Further reading',
      cover: {
        contentUrl:
          'https://via.placeholder.com/400x600.png?text=Placeholder+Book+2',
        width: 400,
        height: 600,
        alt: 'Placeholder book 2',
      },
      promo: undefined,
      labels: [{ text: 'Book' }],
    },
    {
      type: 'books',
      id: 'new-online-book-3',
      uid: 'new-online-book-3',
      title: 'Placeholder Book Three',
      subtitle: 'A deeper dive',
      cover: {
        contentUrl:
          'https://via.placeholder.com/400x600.png?text=Placeholder+Book+3',
        width: 400,
        height: 600,
        alt: 'Placeholder book 3',
      },
      promo: undefined,
      labels: [{ text: 'Book' }],
    },
    {
      type: 'books',
      id: 'new-online-book-4',
      uid: 'new-online-book-4',
      title: 'Placeholder Book Four',
      subtitle: 'Curator picks',
      cover: {
        contentUrl:
          'https://via.placeholder.com/400x600.png?text=Placeholder+Book+4',
        width: 400,
        height: 600,
        alt: 'Placeholder book 4',
      },
      promo: undefined,
      labels: [{ text: 'Book' }],
    },
  ];

  return (
    <Space $v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}>
      <CardGrid items={items} itemsPerRow={4} />
    </Space>
  );
};

export default NewOnline;
