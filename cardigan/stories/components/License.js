import { storiesOf } from '@storybook/react';
import License from '../../../common/views/components/License/License';
import Readme from '../../../common/views/components/License/README.md';
import { select } from '@storybook/addon-knobs';

const LicenseExample = () => {
  const licenseType = select(
    'License types',
    [
      'CC-0',
      'CC-BY',
      'CC-BY-NC',
      'CC-BY-NC-ND',
      'PDM',
      'copyright-not-cleared',
    ],
    'CC-0'
  );
  return <License subject={'test'} licenseType={licenseType.toLowerCase()} />;
};

const stories = storiesOf('Components', module);
stories.add('License', LicenseExample, { info: Readme });
