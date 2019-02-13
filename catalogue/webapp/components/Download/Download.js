// @flow
import { Fragment } from 'react';
import type { LicenseData } from '@weco/common/utils/get-license-info';
import type { LicenseType } from '@weco/common/model/license';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { font, spacing, classNames } from '@weco/common/utils/classnames';
import License from '@weco/common/views/components/License/License';
import Button from '@weco/common/views/components/Buttons/Button/Button';

type Work = Object;
type Props = {|
  work: Work,
  iiifImageLocationUrl: string,
  licenseInfo: LicenseData,
  iiifImageLocationCredit: string,
  iiifImageLocationLicenseId: LicenseType,
|};

const Download = ({
  work,
  iiifImageLocationUrl,
  licenseInfo,
  iiifImageLocationCredit,
  iiifImageLocationLicenseId,
}: Props) => {
  return (
    <Fragment>
      <div className={spacing({ s: 2 }, { margin: ['bottom'] })}>
        <Button
          type="tertiary"
          url={convertImageUri(iiifImageLocationUrl, 'full')}
          target="_blank"
          download={`${work.id}.jpg`}
          rel="noopener noreferrer"
          trackingEvent={{
            category: 'Button',
            action: 'download large work image',
            label: work.id,
          }}
          icon="download"
          text="Download full size"
        />
      </div>

      <div
        className={`${spacing({ s: 3 }, { margin: ['bottom'] })} ${spacing(
          { s: 0 },
          { margin: ['top'] }
        )}`}
      >
        <Button
          type="tertiary"
          url={convertImageUri(iiifImageLocationUrl, 760)}
          target="_blank"
          download={`${work.id}.jpg`}
          rel="noopener noreferrer"
          trackingEvent={{
            category: 'Button',
            action: 'download small work image',
            label: work.id,
          }}
          icon="download"
          text="Download small (760px)"
        />
      </div>

      {(iiifImageLocationCredit || iiifImageLocationLicenseId) && (
        <div className={spacing({ s: 0 }, { margin: ['top'] })}>
          {iiifImageLocationCredit && (
            <p
              className={classNames([
                font({ s: 'HNL5', m: 'HNL4' }),
                spacing({ s: 1 }, { margin: ['bottom'] }),
              ])}
            >
              Credit: {iiifImageLocationCredit}
            </p>
          )}
          {iiifImageLocationLicenseId && (
            <License subject={''} licenseType={iiifImageLocationLicenseId} />
          )}
        </div>
      )}
    </Fragment>
  );
};

export default Download;
