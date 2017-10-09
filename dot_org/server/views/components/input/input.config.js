export const collated = true;

export const context = {
  model: {
    label: 'label'
  }
};

export const variants = [
  {
    name: 'default',
    label: 'Radio',
    context: {
      model: {
        id: 'radio',
        type: 'radio',
        name: 'radio',
        value: 'radio'
      }
    }
  }, {
    name: 'checkbox',
    context: {
      model: {
        id: 'checkbox',
        type: 'checkbox',
        name: 'checkbox',
        value: 'checkbox'
      }
    }
  }, {
    name: 'text',
    context: {
      model: {
        id: 'search',
        type: 'text',
        name: 'text',
        value: '',
        placeholder: 'Search'
      },
      data: {
        isLabelHidden: true
      }
    }
  }
];
