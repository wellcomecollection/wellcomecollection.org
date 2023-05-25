import { singleLineText } from './parts/text';
import keyword from './parts/keyword';
import { CustomType } from './types/CustomType';

const editorialContributorRoles: CustomType = {
  id: 'editorial-contributor-roles',
  label: 'Contributor role',
  repeatable: true,
  status: true,
  json: {
    Contributor: {
      title: singleLineText('Title', {
        extraTextOptions: ['heading1'],
      }),
      describedBy: keyword('Word to describe output of the role'),
    },
  },
  format: 'custom',
};

export default editorialContributorRoles;
