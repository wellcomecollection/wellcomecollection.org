import { createNumberedList } from '../../../model/numbered-list';
import type { Promo } from '../../../model/promo';
import { createPromo } from '../../../model/promo';
import { createPicture } from '../../../model/picture';

const picture = createPicture({
  type: 'picture',
  contentUrl: 'http://placehold.it/1600x900',
  width: 1600,
  height: 900
});

const articleSeries = {
  url: '#',
  name: 'test',
  commissionedLength: 6,
  color: 'orange'
};

const promo: Promo = createPromo({
  type: 'promo',
  url: '#',
  title: 'Title',
  image: picture,
  contentType: 'article',
  description: 'Lorem ipsum, dolor sit amet, yeah?',
  length: 6,
  series: [articleSeries]
});

const promos: Array<Promo> = new Array(6)
  .fill(undefined)
  .map((item, index) => {
    const datePublished = index < 3 ? new Date(2017, 5, index) : null;
    return Object.assign(
      {},
      promo,
      {positionInSeries: index + 1},
      {datePublished: datePublished}
    );
  });

export const name = 'Numbered list';
export const handle = 'numbered-list';

export const model = createNumberedList({
  name: 'Latest',
  items: [
    {
      title: 'Beatboxing tutorial #1: Using the air in your mouth',
      url: '#',
      date: new Date('Wed Feb 22 2017 11:06:25 GMT+0000 (UTC)')
    },
    {
      title: 'Lorem ipsum dolor sit: Amet',

      date: new Date('Wed Feb 22 2017 11:06:25 GMT+0000 (UTC)')
    },
    {
      title: 'Fusce nunc lectus, rutrum sit amet nisi nec, euismod hendrerit eros',
      url: '#',
      date: new Date('Wed Feb 22 2017 11:06:25 GMT+0000 (UTC)')
    },
    {
      title: 'Lorem ipsum dolor sit: Amet',
      url: '#',
      date: new Date('Wed Feb 22 2017 11:06:25 GMT+0000 (UTC)')
    },
    {
      title: 'Fusce nunc lectus, rutrum sit amet nisi nec, euismod hendrerit eros',
      url: '#',
      date: new Date('Wed Feb 22 2017 11:06:25 GMT+0000 (UTC)')
    }
  ]
});

export const model2 = createNumberedList({
  name: 'Making Nature',
  image: {
    contentUrl: 'https://placehold.it/800x450',
    width: 800,
    height: 450
  },
  items: [
    {
      title: 'Part 1: Lorem ipsum',
      url: '#',
      date: new Date('Wed Feb 22 2017 11:06:25 GMT+0000 (UTC)')
    },
    {
      title: 'Part 2: Lorem ipsum dolor sit amet',
      url: '#',
      date: new Date('Wed Feb 22 2017 11:06:25 GMT+0000 (UTC)')
    },
    {
      title: 'Part 3: Fusce nunc lectus',
      url: '#',
      date: new Date('Wed Feb 22 2017 11:06:25 GMT+0000 (UTC)')
    },
    {
      title: 'Part 4: Lorem ipsum dolor sit amet',
      date: new Date('Wed Feb 22 2017 11:06:25 GMT+0000 (UTC)')
    },
    {
      title: 'Part5: Fusce nunc lectus, rutrum sit amet nisi nec, euismod hendrerit eros',
      date: new Date('Wed Feb 22 2017 11:06:25 GMT+0000 (UTC)')
    }
  ]
});

const model3 = createNumberedList({
  name: null,
  items: promos
});

export const context = { model };

export const variants = [
  {
    name: 'horizontal',
    context: {model: model2, modifiers: ['horizontal', 'sticky'], data: {classes: ['js-series-nav'], sliderId: 'id'}}
  },
  {
    name: 'horizontal-narrow',
    context: {model: model2, modifiers: ['horizontal-narrow']}
  },
  {
    name: 'transporter',
    context: {model: model3, modifiers: ['transporter'], data: {classes: ['js-numbered-list-transporter'], sliderId: 'id'}}
  }
];
