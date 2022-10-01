import { multiLineText } from './structured-text';
import list from './list';
import { documentLink } from './link';

const contributors = list('Contributors', {
  role: documentLink({
    label: 'Role',
    linkedType: 'editorial-contributor-roles',
  }),
  contributor: documentLink({
    label: 'Contributor',
    linkedTypes: ['people', 'organisations'],
  }),
  description: multiLineText({ label: 'Contributor description override' }),
});

export default contributors;
