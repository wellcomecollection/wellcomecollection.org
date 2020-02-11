// @flow
import type { LicenseData } from '../../../utils/licenses';

type Props = {|
  subject: string,
  license: LicenseData,
|};

const License = ({ subject, license }: Props) => {
  return (
    <>
      {license.description && `${license.description} `}
      <span about={subject}>
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
