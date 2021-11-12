import structuredText from './parts/structured-text';
import text from './parts/text';

const teams = {
  id: 'teams',
  label: 'Team',
  repeatable: true,
  status: true,
  json: {
    Team: {
      title: structuredText('Title', 'single', ['heading1']),
      subtitle: structuredText('Subtitle', 'single'),
      email: text('Email'),
      phone: text('Phone'),
      url: text('URL'),
    },
  },
};

export default teams;
