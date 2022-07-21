import structuredText from './parts/structured-text';
import text from './parts/text';

const teams = {
  id: 'teams',
  label: 'Team',
  repeatable: true,
  status: true,
  json: {
    Team: {
      title: structuredText({
        label: 'Title',
        allowMultipleParagraphs: false,
        extraTextOptions: ['heading1'],
      }),
      subtitle: structuredText({
        label: 'Subtitle',
        allowMultipleParagraphs: false,
      }),
      email: text('Email'),
      phone: text('Phone'),
      url: text('URL'),
    },
  },
};

export default teams;
