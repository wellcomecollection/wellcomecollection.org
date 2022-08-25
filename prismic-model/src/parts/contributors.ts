import { multiLineText } from './structured-text';
import list from './list';
import link from './link';

const contributors = list('Contributors', {
  role: link('Role', 'document', ['editorial-contributor-roles']),
  contributor: link('Contributor', 'document', ['people', 'organisations']),
  description: multiLineText({ label: 'Contributor description override' }),
});

export default contributors;
