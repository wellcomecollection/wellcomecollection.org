import { LicenseData } from '@weco/common/utils/licenses';
import { FC } from 'react';
type Props = {
  license: LicenseData;
};

const License: FC<Props> = ({ license }: Props) => {
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
