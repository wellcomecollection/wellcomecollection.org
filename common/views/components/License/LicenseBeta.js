// @flow
import { Fragment } from 'react';
import getLicenseInfo from '../../../utils/get-license-info';
import type { LicenseType } from '../../../model/license';
import type { LicenseData } from '../../../utils/get-license-info';

type Props = {|
  subject: string,
  licenseType: LicenseType,
|};

const LicenseBeta = ({ subject, licenseType }: Props) => {
  const licenseInfo: LicenseData = getLicenseInfo(licenseType) || {
    text: '',
    humanReadableText: [''],
  };
  return (
    licenseInfo.description && (
      <Fragment>
        {`${licenseInfo.description} `}
        <span about={subject}>
          {licenseInfo.url && (
            <a rel="license" href={licenseInfo.url}>
              {licenseInfo.text}
            </a>
          )}
          {!licenseInfo.url && licenseInfo.text}
        </span>{' '}
      </Fragment>
    )
  );
};

export default LicenseBeta;
