export const label = 'Button';
export const status = 'graduated';
export const collated = true;
export const variants = [
  {
    name: 'default',
    label: 'primary (button)',
    context: {
      extraClasses: 'btn--primary',
      icon: 'email',
      text: 'Email to book'
    }
  },
  {
    name: 'secondary',
    label: 'secondary (button)',
    context: {
      extraClasses: 'btn--secondary',
      text: 'Cancel'
    }
  },
  {
    name: 'tertiary',
    label: 'tertiary (button)',
    context: {
      icon: 'download',
      extraClasses: 'btn--tertiary',
      text: 'Download full size'
    }
  },
  {
    name: 'default-link',
    label: 'primary (link)',
    context: {
      url: '#',
      extraClasses: 'btn--primary',
      icon: 'email',
      text: 'Email to book'
    }
  },
  {
    name: 'secondary-link',
    label: 'secondary (link)',
    context: {
      url: '#',
      extraClasses: 'btn--secondary',
      text: 'Cancel'
    }
  },
  {
    name: 'tertiary-link',
    label: 'tertiary (link)',
    context: {
      url: '#',
      icon: 'download',
      extraClasses: 'btn--tertiary',
      text: 'Download full size'
    }
  },
  {
    name: 'disabled',
    label: 'disabled',
    context: {
      extraClasses: 'btn--primary',
      disabled: true,
      icon: 'download',
      text: 'Email to book'
    }
  }
];
