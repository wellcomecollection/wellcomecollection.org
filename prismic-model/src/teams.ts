import { singleLineText } from './parts/structured-text';
import text from './parts/text';

const teams = {
  id: 'teams',
  label: 'Team',
  repeatable: true,
  status: true,
  json: {
    Team: {
      title: singleLineText({
        label: 'Title',
        extraTextOptions: ['heading1'],
      }),
      subtitle: singleLineText({ label: 'Subtitle' }),
      email: text('Email'),
      phone: text('Phone'),
      url: text('URL'),
    },
  },
};

export default teams;
