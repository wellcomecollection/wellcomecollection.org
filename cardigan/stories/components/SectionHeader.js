import { storiesOf } from '@storybook/react';
import SectionHeader from '../../../common/views/components/SectionHeader/SectionHeader';
import Readme from '../../../common/views/components/SectionHeader/README.md';
import { text } from '@storybook/addon-knobs/react';

const stories = storiesOf('Components', module);

const SectionHeaderExample = () => {
  const title = text('Title', 'You may have missed');
  const linkText = text('Link text', 'More articles');
  return (
    <SectionHeader title={title} linkUrl='#' linkText={linkText} />
  );
};

stories
  .add('Section header', SectionHeaderExample, {
    info: Readme
  });
