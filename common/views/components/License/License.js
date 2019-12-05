// @flow
import { Fragment } from 'react';
import type { LicenseData } from '../../../utils/get-license-info';

type Props = {|
  subject: string,
  licenseInfo: LicenseData,
|};

const License = ({ subject, licenseInfo }: Props) => {
  return (
    <Fragment>
      <Fragment>
        {licenseInfo.description && `${licenseInfo.description} `}
        <span about={subject}>
          {licenseInfo.url && (
            <a rel="license" href={licenseInfo.url}>
              {licenseInfo.text}
            </a>
          )}
          {!licenseInfo.url && licenseInfo.text}
        </span>
      </Fragment>
    </Fragment>
  );
};

export default License;
