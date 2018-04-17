import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CTA from '../../common/views/components/actions/CTA';

storiesOf('CTA', module)
  .add('with text', () => (
    <CTA
      text='Hello Button'
      onClick={action('clicked')} />
  ));
