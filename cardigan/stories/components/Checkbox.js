import { storiesOf } from '@storybook/react';
import CheckboxWithLabel from '../../../common/views/components/Checkbox/Checkbox';
import Readme from '../../../common/views/components/Checkbox/README.md';

const stories = storiesOf('Components', module);

const CheckboxExample = () => <CheckboxWithLabel id="yo" text="Manuscripts" />;

stories.add('Checkbox', CheckboxExample, {
  readme: { sidebar: Readme },
});
