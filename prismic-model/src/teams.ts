import structuredText from './parts/structured-text';
import text from './parts/text';

const Teams = {
  Contact: {
    title: structuredText('Title', 'single', ['heading1']),
    subtitle: structuredText('Subtitle', 'single'),
    email: text('Email'),
    phone: text('Phone'),
    url: text('URL'),
  },
};

export default Teams;
