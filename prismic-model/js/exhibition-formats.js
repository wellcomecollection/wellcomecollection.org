import title from './parts/title';
import structuredText from './parts/structured-text';

const ExhibitionFormats = {
  'Exhibition format': {
    title,
    description: structuredText('Description', 'single')
  }
};

export default ExhibitionFormats;
