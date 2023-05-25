import { singleLineText } from './parts/text';
import keyword from './parts/keyword';

const teams = {
  id: 'teams',
  label: 'Team',
  repeatable: true,
  status: true,
  json: {
    Team: {
      title: singleLineText('Title', { extraTextOptions: ['heading1'] }),
      subtitle: singleLineText('Subtitle'),
      email: keyword('Email'),
      phone: keyword('Phone'),
      url: keyword('URL'),
    },
  },
  format: 'custom',
};

export default teams;
