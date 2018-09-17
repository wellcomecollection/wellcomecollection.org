import { storiesOf } from '@storybook/react';
import Breadcrumb from '../../../common/views/components/Breadcrumb/Breadcrumb';
import Readme from '../../../common/views/components/Breadcrumb/README.md';

const BreadcrumbExample = () => {
  return <Breadcrumb items={[{
    text: 'Content type',
    url: '/content-type'
  }, {
    prefix: 'Part of',
    text: 'The Ambroise Paré collection',
    url: '/part-of/this'
  }]} />;
};

const stories = storiesOf('Components', module);
stories
  .add('Breadcrumb', BreadcrumbExample, {info: Readme});
