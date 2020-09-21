import { storiesOf } from '@storybook/react';
import CheckboxRadio from '../../../common/views/components/CheckboxRadio/CheckboxRadio';
import Readme from '../../../common/views/components/CheckboxRadio/README.md';
import { select } from '@storybook/addon-knobs';

const stories = storiesOf('Components', module);

const CheckboxRadioExample = () => {
  const type = select('Type', ['checkbox', 'radio'], 'checkbox');
  return <CheckboxRadio id="yo" type={type} text="Manuscripts" />;
};

stories.add('CheckboxRadio', CheckboxRadioExample, {
  readme: { sidebar: Readme },
});
