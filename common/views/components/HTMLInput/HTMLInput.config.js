export const collated = true;
export const label = 'HTML input';

export const context = {
  label: 'label'
};

export const variants = [
  {
    name: 'default',
    label: 'Radio',
    context: {
      id: 'radio',
      type: 'radio',
      name: 'radio',
      value: 'radio'
    }
  }, {
    name: 'checkbox',
    context: {
      id: 'checkbox',
      type: 'checkbox',
      name: 'checkbox',
      value: 'checkbox'
    }
  }, {
    name: 'text',
    context: {
      id: 'search',
      type: 'text',
      name: 'text',
      value: '',
      placeholder: 'Search',
      isLabelHidden: true
    }
  }
];
