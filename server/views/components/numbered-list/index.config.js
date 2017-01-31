import { NumberedList } from '../../../model/numbered-list';

export const name = 'Numbered list';
export const handle = 'numbered-list';

export const numberedList = new NumberedList({
  heading: 'Latest',
  items: [
    {
      title: 'Beatboxing tutorial #1: Using the air in your mouth',
      url: '#',
      meta: 'Today'
    },
    {
      title: 'Lorem ipsum dolor sit: Amet',
      url: '#',
      meta: 'Yesterday'
    },
    {
      title: 'Fusce nunc lectus, rutrum sit amet nisi nec, euismod hendrerit eros',
      url: '#',
      meta: 'A week ago'
    },
    {
      title: 'Lorem ipsum dolor sit: Amet',
      url: '#',
      meta: '2 weeks ago'
    },
    {
      title: 'Fusce nunc lectus, rutrum sit amet nisi nec, euismod hendrerit eros',
      url: '#',
      meta: '3 weeks ago'
    }
  ]
}).toJS();

export const context = { numberedList };
