import title from './parts/title';
import structuredText from './parts/structured-text';

const Interpretations = {
  Interpretation: {
    title,
    abbreviation: structuredText('Abbreviation', 'single'),
    description: structuredText('Message', 'single'),
    primaryDescription: structuredText('Message if primary interpretation', 'multi'),
  }
};

export default Interpretations;
