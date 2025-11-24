import { FunctionComponent } from 'react';

import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import WorkCard, { WorkItem } from '@weco/content/views/components/WorkCard';

const items: WorkItem[] = [
  {
    url: 'https://wellcomecollection.org/works/ptfqa2te',
    title: 'Scans of drawings used as newsletter covers',
    image: {
      contentUrl:
        'https://iiif.wellcomecollection.org/thumbs/PPDBL_A_7---DAYCENTRE2.BMP/full/291,400/0/default.jpg',
      width: 291,
      height: 400,
      alt: '',
    },
    labels: [{ text: 'Born-digital archives' }],
    partOf: 'David Beales: archive',
    date: 'c.1990s-c.2000s',
  },
  {
    url: 'https://wellcomecollection.org/works/bbsjt2ex',
    title:
      'The Breviarie of health, wherein doth folow, remedies, for all manner of sicknesses and diseases, the which may be in man or woman.',
    image: {
      contentUrl:
        'https://iiif.wellcomecollection.org/image/b30321025_0009.jp2/full/316,400/0/default.jpg',
      width: 316,
      height: 400,
      alt: 'The Breviarie of health book cover',
    },
    labels: [{ text: 'Books' }],
    contributor: 'Boorde, Andrew, 1490?-1549.',
    date: '1575',
  },
  {
    url: 'https://wellcomecollection.org/works/a3cyqwec',
    title: 'MS Hindi (Indic) beta 511.',
    image: {
      contentUrl:
        'https://iiif.wellcomecollection.org/thumbs/b33599051_0001.jp2/full/316,400/0/default.jpg',
      width: 316,
      height: 400,
      alt: 'MS Hindi (Indic) beta 511 book cover',
    },
    labels: [{ text: 'Manuscripts' }],
  },
  {
    url: 'https://wellcomecollection.org/works/sh37yy5n',
    title: 'An introduction to the study of human anatomy (Volume 1).',
    image: {
      contentUrl:
        'https://iiif.wellcomecollection.org/thumbs/b21146287_0005.jp2/full/220,400/0/default.jpg',
      width: 220,
      height: 400,
      alt: 'An introduction to the study of human anatomy book cover',
    },
    labels: [{ text: 'Books' }],
    contributor: 'Paxton, James, 1786-1860.',
    date: '1835',
  },
];

const NewOnline: FunctionComponent = () => {
  return (
    <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
      <Grid>
        {items.map(item => (
          <GridCell
            key={item.url}
            $sizeMap={{ s: [12], m: [6], l: [3], xl: [3] }}
          >
            <WorkCard item={item} />
          </GridCell>
        ))}
      </Grid>
    </Space>
  );
};

export default NewOnline;
