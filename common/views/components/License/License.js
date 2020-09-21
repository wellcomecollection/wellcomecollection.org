// @flow
import type { LicenseData } from '../../../utils/licenses';
type Props = {|
  license: LicenseData,
|};

const License = ({ license }: Props) => {
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
