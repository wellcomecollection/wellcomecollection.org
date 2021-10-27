import title from './parts/title';
import structuredText from './parts/structured-text';

const Audiences = {
  Audience: {
    title,
    description: structuredText('Description', 'single'),
  },
};

export default Audiences;
