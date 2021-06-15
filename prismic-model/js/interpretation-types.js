import specificStructuredText from './parts/specific-structured-text';

const Interpretations = {
  Interpretation: {
    title: specificStructuredText({
      singleOrMulti: 'single',
      htmlTypes: ['heading1'],
      label: 'Title',
      useAsTitle: true,
    }),
    abbreviation: specificStructuredText({
      singleOrMulti: 'single',
      htmlTypes: ['paragraph'],
      label: 'Abbreviation',
    }),
    description: specificStructuredText({
      singleOrMulti: 'multi',
      htmlTypes: ['paragraph, hyperlink'],
      label: 'Message',
    }),
    primaryDescription: specificStructuredText({
      singleOrMulti: 'multi',
      htmlTypes: ['paragraph, hyperlink'],
      label: 'Message if primary interpretation',
    }),
  }
};

export default Interpretations;
