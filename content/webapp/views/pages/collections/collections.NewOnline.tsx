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
    url: 'https://wellcomecollection.org/works/ecgby5kb',
    title:
      'The life of Florence Nightingale / by Sarah A. Tooley, with 22 illustrations.',
    image: {
      contentUrl:
        'https://iiif.wellcomecollection.org/thumbs/b33396607_0004_0007.jp2/full/252,400/0/default.jpg',
      width: 252,
      height: 400,
      alt: 'The life of Florence Nightingale',
    },
    labels: [{ text: 'Books' }],
    contributor: 'Tooley, Sarah A., 1857-',
    date: '1904',
  },
  {
    url: 'https://wellcomecollection.org/works/fmvhyt82',
    title:
      "Wampole's Preparation : tonic and stimulant for all ages / Leon P. DuPlessis.",
    image: {
      contentUrl:
        'https://iiif.wellcomecollection.org/thumbs/b16637367_0001.jp2/full/324,400/0/default.jpg',
      width: 324,
      height: 400,
      alt: "Wampole's Preparation ephemera",
    },
    labels: [{ text: 'Ephemera' }],
    contributor: 'DuPlessis, Leon P.',
    date: '[between 1930 and 1939?]',
  },
  {
    url: 'https://wellcomecollection.org/works/c2yce27k',
    title: 'That’s the Limit: a guide to sensible drinking',
    image: {
      contentUrl:
        'https://iiif.wellcomecollection.org/thumbs/b32198292_0001.jp2/full/200,190/0/default.jpg',
      width: 200,
      height: 190,
      alt: 'That’s the Limit: a guide to sensible drinking',
    },
    labels: [{ text: 'Archives and manuscripts' }],
    contributor: 'Health Education Council',
    date: '1970s-1990s',
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
