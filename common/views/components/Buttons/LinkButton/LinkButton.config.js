export const label = 'Link Button';
export const collated = true;

export const variants = [
  {
    name: 'default',
    label: 'primary',
    context: {
      extraClasses: 'btn--primary',
      icon: 'email',
      text: 'Email to book'
    }
  },
  {
    name: 'secondary',
    label: 'secondary',
    context: {
      extraClasses: 'btn--secondary',
      text: 'Cancel'
    }
  },
  {
    name: 'tertiary',
    label: 'tertiary',
    context: {
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
