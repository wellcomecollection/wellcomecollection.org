import { useState } from 'react';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import PlainList from '@weco/common/views/components/styled/PlainList';
import ToolbarSegmentedControl from '@weco/content/components/ToolbarSegmentedControl/ToolbarSegmentedControl';
import { chevron, digitalImage, eye, gridView } from '@weco/common/icons';
import ControlReadme from '@weco/common/views/components/Buttons/Control/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';

const ButtonSolidTemplate = args => <ButtonSolid {...args} />;
export const buttonSolid = ButtonSolidTemplate.bind({});
buttonSolid.args = {
  disabled: false,
  icon: eye,
  text: 'Click me',
};
buttonSolid.storyName = 'ButtonSolid';

const ControlTemplate = args => (
  <ReadmeDecorator
    WrappedComponent={Control}
    args={args}
    Readme={ControlReadme}
  />
);
export const control = ControlTemplate.bind({});
control.args = {
  text: 'something for screenreaders',
  icon: chevron,
  colorScheme: 'light',
};
control.storyName = 'Control';

const ToolbarSegmentedControlTemplate = args => {
  const [activeId, setActiveId] = useState('page');

  return (
    <div style={{ padding: '50px', background: '#333' }}>
      <ToolbarSegmentedControl
        activeId={activeId}
        hideLabels={args.hideLabels}
        items={[
          {
            id: 'page',
            icon: digitalImage,
            label: 'Page',
            clickHandler: () => setActiveId('page'),
          },
          {
            id: 'grid',
            icon: gridView,
            label: 'Grid',
            clickHandler: () => setActiveId('grid'),
          },
        ]}
      />
    </div>
  );
};
export const toolbarSegmentedControl = ToolbarSegmentedControlTemplate.bind({});
toolbarSegmentedControl.args = {
  hideLabels: true,
};
toolbarSegmentedControl.storyName = 'ToolbarSegmentedControl';

const DropdownButtonTemplate = args => {
  return (
    <DropdownButton label="Filters" buttonType={args.buttonType} id="example">
      <div>
        <PlainList>
          <li>
            <CheckboxRadio
              id="1"
              type="checkbox"
              text="Manuscripts (1,856)"
              checked={false}
              onChange={null}
            />
          </li>
          <li>
            <CheckboxRadio
              id="2"
              type="checkbox"
              text="Archives (1,784)"
              checked={false}
              onChange={null}
            />
          </li>
          <li>
            <CheckboxRadio
              id="3"
              type="checkbox"
              text="Images (2,122)"
              checked={false}
              onChange={null}
            />
          </li>
          <li>
            <CheckboxRadio
              id="4"
              type="checkbox"
              text="Books (12,465)"
              checked={false}
              onChange={null}
            />
          </li>
        </PlainList>
      </div>
    </DropdownButton>
  );
};
export const dropdownButton = DropdownButtonTemplate.bind({});
dropdownButton.args = {
  isInline: false,
};
dropdownButton.storyName = 'DropdownButton';
