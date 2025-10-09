import { FunctionComponent } from 'react';

import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import type { BookBasic } from '@weco/content/types/books';
import TbcCard from '@weco/content/views/components/tbcCard';

const items: BookBasic[] = [
  {
    // url: https://wellcomecollection.org/works/a3cyqwec
    type: 'books',
    id: 'scans',
    uid: 'scans-of-drawings-used-as-newsletter-covers',
    title: 'Scans of drawings used as newsletter covers',
    subtitle: undefined,
    cover: {
      contentUrl: 'https://placehold.co/400x300/000000/FFFFFF/png',
      width: 400,
      height: 300,
      alt: 'Scans of drawings used as newsletter covers',
    },
    promo: undefined,
    labels: [{ text: 'Born-digital archives' }],
    meta: 'Part of: David Beales: archive',
  },
  {
    // https://wellcomecollection.org/works/ecgby5kb
    type: 'books',
    id: 'the-life-of',
    uid: 'the-life-of-florence-nightingale',
    title: 'The life of Florence Nightingale (1904, including illustrations)',
    subtitle: undefined,
    cover: {
      contentUrl: 'https://placehold.co/200x309/000000/FFFFFF/png',
      width: 200,
      height: 309,
      alt: 'The life of Florence Nightingale',
    },
    promo: undefined,
    labels: [{ text: 'Book' }],
  },
  {
    // 'https://wellcomecollection.org/works/fmvhyt82'
    type: 'books',
    id: 'Wampole',
    uid: 'Wampole-preparation-tonic-and-stimulant-for-all-ages',
    title:
      "Wampole's Preparation: tonic and stimulant for all ages (1930s ephemera)",
    subtitle: undefined,
    cover: {
      contentUrl: 'https://placehold.co/400x340/000000/FFFFFF/png',
      width: 400,
      height: 340,
      alt: "Wampole's Preparation ephemera",
    },
    promo: undefined,
    labels: [{ text: 'Ephemera' }],
  },
  {
    // https://wellcomecollection.org/works/c2yce27k
    type: 'books',
    id: 'limit',
    uid: 'thats-the-limit',
    title: 'That’s the Limit: a guide to sensible drinking',
    subtitle: undefined,
    cover: {
      contentUrl: 'https://placehold.co/200x285/000000/FFFFFF/png',
      width: 200,
      height: 285,
      alt: 'That’s the Limit: a guide to sensible drinking',
    },
    promo: undefined,
    labels: [{ text: 'Archives and manuscripts' }],
  },
];

// TODO reuse bookImage but call that something else
const NewOnline: FunctionComponent = () => {
  return (
    <Space $v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}>
      <Grid>
        {items.map(book => (
          <GridCell
            key={book.id}
            $sizeMap={{ s: [12], m: [6], l: [3], xl: [3] }}
          >
            <TbcCard book={book} />
          </GridCell>
        ))}
      </Grid>
    </Space>
  );
};

export default NewOnline;
