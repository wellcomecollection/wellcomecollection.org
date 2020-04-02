import { storiesOf } from '@storybook/react';
import DropdownButton from '../../../common/views/components/DropdownButton/DropdownButton';
import CheckboxRadio from '../../../common/views/components/CheckboxRadio/CheckboxRadio';
import Readme from '../../../common/views/components/DropdownButton/README.md';

const DropdownButtonExample = () => {
  return (
    <DropdownButton label={'Filters'}>
      <div>
        <ul className="plain-list no-margin no-padding">
          <li>
            <CheckboxRadio
              id="1"
              type={`checkbox`}
              text="Manuscripts (1,856)"
            />
          </li>
          <li>
            <CheckboxRadio id="2" type={`checkbox`} text="Archives (1,784)" />
          </li>
          <li>
            <CheckboxRadio id="3" type={`checkbox`} text="Images (2,122)" />
          </li>
          <li>
            <CheckboxRadio id="4" type={`checkbox`} text="Books (12,465)" />
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
