export const name = 'Page description';
export const handle = 'page-description';
export const label = 'Page description';
export const status = 'graduated';
export const preview = '@preview-no-container';
export const collated = true;

export const variants = [
  {
    name: 'default',
    label: 'A (article)',
    context: {
      model: {
        lead: true,
        title: 'Inspired: Alchemists and housewives around a long table',
        meta: {
          type: 'date',
          value: new Date(2016, 9, 9)
        }
      },
      modifiers: {'a': true}
    }
  },
  {
    name: 'hn',
    label: 'B (library item)',
    context: {
      model: {
        title: 'On the Origin of Species by Means of Natural Selection, or the Preservation'
      },
      modifiers: {'b': true}
    }
  }
];
