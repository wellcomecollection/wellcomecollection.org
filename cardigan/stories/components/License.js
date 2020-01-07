import { storiesOf } from '@storybook/react';
import License from '../../../common/views/components/License/License';
import getLicenseInfo from '../../../common/utils/get-license-info';
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
      'CC-BY-ND',
      'CC-BY-SA',
      'CC-BY-NC-SA',
      'PDM',
      'OGL',
      'OPL',
      'in-copyright',
      'inc',
    ],
    'CC-0'
  );
  return (
    <License
      subject={'test'}
      licenseInfo={getLicenseInfo(licenseType.toLowerCase())}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('License', LicenseExample, { readme: { sidebar: Readme } });
