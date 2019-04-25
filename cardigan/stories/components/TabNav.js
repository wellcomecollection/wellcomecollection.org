import { storiesOf } from '@storybook/react';
import TabNav from '../../../common/views/components/TabNav/TabNav';
import Readme from '../../../common/views/components/TabNav/README.md';
import { ThemeProvider } from 'styled-components';
import theme from '../../../common/views/themes/default';

const stories = storiesOf('Components', module);

const TabNavExample = () => (
  <ThemeProvider theme={theme}>
    <TabNav
      large={true}
      items={[
        {
          text: 'All',
          link: {
            href: {
              pathname: '',
            },
          },
          selected: true,
        },
        {
          text: 'Books',
          link: {
            href: {
              pathname: '',
            },
          },

          selected: false,
        },
        {
          text: 'Pictures',
          link: {
            href: {
              pathname: '',
            },
          },

          selected: false,
        },
      ]}
    />
  </ThemeProvider>
);

stories.add('TabNav', TabNavExample, {
  readme: { sidebar: Readme },
});
