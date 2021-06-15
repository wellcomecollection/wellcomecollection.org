import title from './parts/title';
import specificStructuredText from './parts/specific-structured-text';

const Audiences = {
  Audience: {
    title,
    description: specificStructuredText({
      singleOrMulti: 'single',
      htmlTypes: ['paragraph'],
      label: 'Description',
    }),
  },
};

export default Audiences;
