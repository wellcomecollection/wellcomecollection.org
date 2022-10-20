import { LicenseData } from '@weco/common/utils/licenses';
import { FunctionComponent } from 'react';
type Props = {
  license: LicenseData;
};

const License: FunctionComponent<Props> = ({ license }: Props) => {
  return (
    <>
      {license.description && `${license.description} `}
      <span>
        {license.url && (
          <a rel="license" href={license.url}>
            {license.label}
          </a>
        )}
        {!license.url && license.label}
      </span>
    </>
  );
};

export default License;
