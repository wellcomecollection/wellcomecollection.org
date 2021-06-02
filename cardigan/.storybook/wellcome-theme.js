import { create } from '@storybook/theming';
import { themeValues } from '@weco/common/views/themes/config';

export default create({
  base: 'light',
  brandTitle: 'Cardigan',
  brandUrl: 'https://wellcomecollection.org',
  brandImage:
    'https://cardigan.wellcomecollection.org/cardigan-theme/assets/favicon.ico',
  fontBase: '"Helvetica Neue", sans-serif',
});
