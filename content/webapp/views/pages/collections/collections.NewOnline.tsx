import { FunctionComponent } from 'react';

import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import TbcCard, { TbcItem } from '@weco/content/views/components/tbcCard';

const items: TbcItem[] = [
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
    meta: 'Part of: David Beales: archive',
  },
  {
    url: 'https://wellcomecollection.org/works/ecgby5kb',
    title: 'The life of Florence Nightingale (1904, including illustrations)',
    image: {
      contentUrl:
        'https://iiif.wellcomecollection.org/thumbs/b33396607_0004_0007.jp2/full/252,400/0/default.jpg',
      width: 252,
      height: 400,
      alt: 'The life of Florence Nightingale',
    },
    labels: [{ text: 'Book' }],
    meta: undefined,
  },
  {
    url: 'https://wellcomecollection.org/works/fmvhyt82',
    title:
      "Wampole's Preparation: tonic and stimulant for all ages (1930s ephemera)",
    image: {
      contentUrl:
        'https://iiif.wellcomecollection.org/thumbs/b16637367_0001.jp2/full/324,400/0/default.jpg',
      width: 324,
      height: 400,
      alt: "Wampole's Preparation ephemera",
    },
    labels: [{ text: 'Ephemera' }],
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
  },
];

const NewOnline: FunctionComponent = () => {
  return (
    <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
      <Grid>
        {items.map(item => (
          <GridCell
            key={item.url}
            $sizeMap={{ s: [12], m: [6], l: [3], xl: [3] }}
          >
            <TbcCard item={item} />
          </GridCell>
        ))}
      </Grid>
    </Space>
  );
};

export default NewOnline;
