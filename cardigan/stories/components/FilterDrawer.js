import { storiesOf } from '@storybook/react';
import FilterDrawer from '../../../common/views/components/FilterDrawer/FilterDrawer';
import Readme from '../../../common/views/components/FilterDrawer/README.md';

const stories = storiesOf('Components', module);

stories.add(
  'FilterDrawer',
  () => (
    <div>
      <FilterDrawer />
      <p style={{ marginTop: '20px' }}>
        Dummy content to demo drawer height animation change
      </p>
    </div>
  ),
  {
    readme: { sidebar: Readme },
  }
);
