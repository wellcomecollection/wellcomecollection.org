import { storiesOf } from '@storybook/react';
import { text, array } from '@storybook/addon-knobs';
import Contributors from '../../../common/views/components/Contributors/Contributors';
import ContributorsReadme from '../../../common/views/components/Contributors/README.md';
import { organisation, person } from '../content';

const stories = storiesOf('Components', module);
stories
  .add('Contributors', () => {
    const contributorTitle = text('Contributors title', '');
    const roles = array('Roles', ['Speaker', 'Speaker']);

    const contributors = roles.map(role => {
      if (role === 'Partner') {
        return {
          contributor: {
            type: 'organisations',
            id: 'xxx',
            ...organisation()
          },
          role: {
            id: 'xxx',
            title: role
          },
          description: null
        };
      } else {
        return {
          contributor: {
            type: 'people',
            id: 'xxx',
            ...person()
          },
          role: {
            id: 'xxx',
            title: role
          },
          description: null
        };
      }
    });

    return <Contributors
      titleOverride={contributorTitle}
      contributors={contributors} />;
  }, {
    info: ContributorsReadme
  });
