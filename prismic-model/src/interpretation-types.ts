import title from './parts/title';
import structuredText from './parts/structured-text';

const Interpretations = {
  Interpretation: {
    title,
    // TODO: This should be a Key text field
    // see: https://prismic.io/docs/core-concepts/key-text
    abbreviation: structuredText('Abbreviation', 'single', [], undefined, [
      'paragraph',
    ]),
    description: structuredText('Message', 'single'),
    primaryDescription: structuredText(
      'Message if primary interpretation',
      'multi'
    ),
  },
};

export default Interpretations;
