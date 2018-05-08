export const label = 'Control';
export const status = 'graduated';
export const collated = true;
export const variants = [
  {
    name: 'default',
    label: 'light (button)',
    context: {
      icon: 'download',
      type: 'light',
      text: 'download'
    }
  },
  {
    name: 'dark',
    label: 'dark (button)',
    context: {
      icon: 'download',
      type: 'dark',
      text: 'download'
    }
  },
  {
    name: 'light-link',
    label: 'light (link)',
    context: {
      url: '#',
      icon: 'download',
      type: 'light',
      text: 'download'
    }
  },
  {
    name: 'dark-link',
    label: 'dark (link)',
    context: {
      url: '#',
      icon: 'download',
      type: 'dark',
      text: 'download'
    }
  }
];
