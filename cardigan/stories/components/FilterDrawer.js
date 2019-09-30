import { storiesOf } from '@storybook/react';
import FilterDrawer from '../../../common/views/components/FilterDrawer/FilterDrawer';
import Readme from '../../../common/views/components/FilterDrawer/README.md';

const stories = storiesOf('Components', module);

const ComponentOne = () => <p>One</p>;
const ComponentTwo = () => (
  <p>
    Two
    <br />
    Second line
    <br />
    Third line
  </p>
);
const ComponentThree = () => (
  <p>
    Three
    <br />
    Another line
  </p>
);
const FilterDrawerExample = () => (
  <div>
    <FilterDrawer
      items={[
        { title: 'One', component: <ComponentOne /> },
        { title: 'Two', component: <ComponentTwo /> },
        { title: 'Three', component: <ComponentThree /> },
      ]}
    />
    <p style={{ marginTop: '20px' }}>
      Dummy content to demo drawer height animation change
    </p>
  </div>
);

stories.add('FilterDrawer', FilterDrawerExample, {
  readme: { sidebar: Readme },
});
