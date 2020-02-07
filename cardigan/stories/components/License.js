import { storiesOf } from '@storybook/react';
import License from '../../../common/views/components/License/License';
import { getLicenseInfo } from '../../../common/utils/licenses';
import Readme from '../../../common/views/components/License/README.md';
import { select } from '@storybook/addon-knobs';

const LicenseExample = () => {
  const license = select(
    'License types',
    ['CC-0', 'CC-BY', 'CC-BY-NC', 'CC-BY-NC-ND', 'PDM'],
    'CC-0'
  );
  return <License subject={'test'} license={getLicenseInfo(license)} />;
};

const stories = storiesOf('Components', module);
stories.add('License', LicenseExample, { readme: { sidebar: Readme } });
