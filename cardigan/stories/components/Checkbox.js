import { storiesOf } from '@storybook/react';
import Checkbox from '../../../common/views/components/Checkbox/Checkbox';
import Readme from '../../../common/views/components/Checkbox/README.md';

const stories = storiesOf('Components', module);

const CheckboxExample = () => <Checkbox id="yo" text="Manuscripts" />;

stories.add('Checkbox', CheckboxExample, {
  readme: { sidebar: Readme },
});
