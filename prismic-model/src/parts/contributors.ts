import { multiLineText } from './text';
import list from './list';
import { documentLink } from './link';

const contributors = list('Contributors', {
  role: documentLink('Role', {
    linkedType: 'editorial-contributor-roles',
  }),
  contributor: documentLink('Contributor', {
    linkedTypes: ['people', 'organisations'],
  }),
  description: multiLineText('Contributor description override'),
});

export default contributors;
