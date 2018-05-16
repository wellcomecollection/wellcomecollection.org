export const label = 'Button';
export const status = 'graduated';
export const collated = true;
export const variants = [
  {
    name: 'default',
    label: 'primary (button)',
    context: {
      type: 'primary',
      icon: 'email',
      text: 'Email to book'
    }
  },
  {
    name: 'secondary',
    label: 'secondary (button)',
    context: {
      type: 'secondary',
      text: 'Cancel'
    }
  },
  {
    name: 'tertiary',
    label: 'tertiary (button)',
    context: {
      icon: 'download',
      type: 'tertiary',
      text: 'Download full size'
    }
  },
  {
    name: 'default-link',
    label: 'primary (link)',
    context: {
      url: '#',
      type: 'primary',
      icon: 'email',
      text: 'Email to book'
    }
  },
  {
    name: 'secondary-link',
    label: 'secondary (link)',
    context: {
      url: '#',
      type: 'secondary',
      text: 'Cancel'
    }
  },
  {
    name: 'tertiary-link',
    label: 'tertiary (link)',
    context: {
      url: '#',
      icon: 'download',
      type: 'tertiary',
      text: 'Download full size'
    }
  },
  {
    name: 'disabled',
    label: 'disabled',
    context: {
      type: 'primary',
      disabled: true,
      icon: 'download',
      text: 'Email to book'
    }
  }
];
