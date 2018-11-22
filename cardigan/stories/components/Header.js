import { storiesOf } from '@storybook/react';
import Header from '../../../common/views/components/Header/Header';
import Readme from '../../../common/views/components/Header/README.md';

const HeaderExample = () => {
  return <Header
    siteSection={`stories`}
    isActive={true}
    links={
      [
        {
          'href': 'https://wellcomecollection.org/visit',
          'title': 'Visit us',
          'siteSection': 'visitus'
        },
        {
          'href': 'https://wellcomecollection.org/whats-on',
          'title': "What's on",
          'siteSection': 'whatson'
        },
        {
          'href': '/stories',
          'title': 'Stories',
          'siteSection': 'stories'
        },
        {
          'href': '/works',
          'title': 'Images',
          'siteSection': 'images'
        },
        {
          'href': 'https://wellcomecollection.org/what-we-do',
          'title': 'What we do',
          'siteSection': 'whatwedo'
        }
      ]
    } />;
};

const stories = storiesOf('Components', module);
stories
  .add('Header', HeaderExample, {info: Readme});
