export const context = {
  model: {
    inputs: [
      {
        label: 'Best match',
        type: 'radio',
        id: 'sort-best-match',
        name: 'sort',
        value: ''
      },
      {
        label: 'Newest',
        type: 'radio',
        id: 'sort-newest',
        name: 'sort',
        value: 'DESC'
      },
      {
        label: 'Oldest',
        type: 'radio',
        id: 'sort-oldest',
        name: 'sort',
        value: 'ASC'
      }
    ]
  }
};
