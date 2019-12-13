import { storiesOf } from '@storybook/react';
import DropdownButton from '../../../common/views/components/DropdownButton/DropdownButton';
import Checkbox from '../../../common/views/components/Checkbox/Checkbox';
import Readme from '../../../common/views/components/DropdownButton/README.md';

const DropdownButtonExample = () => {
  return (
    <DropdownButton buttonText={'Filters'}>
      <div>
        <ul className="plain-list no-margin no-padding">
          <li>
            <Checkbox id="1" text="Manuscripts (1,856)" />
          </li>
          <li>
            <Checkbox id="2" text="Archives (1,784)" />
          </li>
          <li>
            <Checkbox id="3" text="Images (2,122)" />
          </li>
          <li>
            <Checkbox id="4" text="Books (12,465)" />
          </li>
        </ul>
      </div>
    </DropdownButton>
  );
};

const stories = storiesOf('Components', module);
stories.add('DropdownButton', DropdownButtonExample, {
  readme: { sidebar: Readme },
});
