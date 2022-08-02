import { singleLineText } from './parts/structured-text';
import text from './parts/text';
import { CustomType } from './types/CustomType';

const editorialContributorRoles: CustomType = {
  id: 'editorial-contributor-roles',
  label: 'Contributor role',
  repeatable: true,
  status: true,
  json: {
    Contributor: {
      title: singleLineText({
        label: 'Title',
        extraTextOptions: ['heading1'],
      }),
      describedBy: text('Word to describe output of the role'),
    },
  },
};

export default editorialContributorRoles;
