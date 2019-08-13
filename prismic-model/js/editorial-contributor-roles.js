import structuredText from './parts/structured-text';
import text from './parts/text';

const ContributorRoles = {
  Contributor: {
    title: structuredText('Title', 'single', ['heading1']),
    describedBy: text('Byline word for role', 'e.g. words'),
  },
};

export default ContributorRoles;
