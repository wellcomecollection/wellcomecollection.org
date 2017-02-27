import { createNumberedList } from '../../../model/numbered-list';

export const name = 'Numbered list';
export const handle = 'numbered-list';
export const collated = true;

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

export const context = { model };

export const variants = [
  {
    name: 'Horizontal list',
    context: {model: model2, modifiers: ['horizontal']}
  },
  {
    name: 'Horizontal list narrow',
    context: {model: model2, modifiers: ['horizontal-narrow']}
  }
];
