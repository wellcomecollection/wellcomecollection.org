import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withDocs }  from 'storybook-readme';
import PrimaryButton from '../../common/views/components/Buttons/PrimaryButton/PrimaryButton';
import PrimaryButtonReadme from '../../common/views/components/Buttons/PrimaryButton/README.md';
import SecondaryButton from '../../common/views/components/Buttons/SecondaryButton/SecondaryButton';
import SecondaryButtonReadme from '../../common/views/components/Buttons/SecondaryButton/README.md';
import TertiaryButton from '../../common/views/components/Buttons/TertiaryButton/TertiaryButton';
import TertiaryButtonReadme from '../../common/views/components/Buttons/TertiaryButton/README.md';

storiesOf('Buttons', module)
  .add('Primary button', withDocs(PrimaryButtonReadme, () => (
    <PrimaryButton
      text='Hello Button'
      onClick={action('clicked')} />
  )))
  .add('Secondary button', withDocs(SecondaryButtonReadme, () => (
    <SecondaryButton
      primaryButton={
        <PrimaryButton
          text='Hello Button'
          onClick={action('clicked')} />
      }
      text='Hello Button'
      onClick={action('clicked')} />
  )))
  .add('Tertiary button', withDocs(TertiaryButtonReadme, () => (
    <TertiaryButton
      text='Hello Button'
      onClick={action('clicked')} />
  )));
