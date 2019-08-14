import structuredText from './parts/structured-text';
import text from './parts/text';

const ContributorRoles = {
  Contributor: {
    title: structuredText('Title', 'single', ['heading1']),
    describedBy: text('Word to describe output of the role'),
  },
};

export default ContributorRoles;
