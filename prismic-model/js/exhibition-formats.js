import structuredText from './parts/structured-text';

const ExhibitionFormats = {
  'Exhibition format': {
    title: structuredText('Title', 'single', ['h1']),
    description: structuredText('Description', 'single')
  }
};

export default ExhibitionFormats;
