// @flow
import type { LicenseData } from '../../../utils/get-license-info';
import Icon from '@weco/common/views/components/Icon/Icon';
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
            {license.text}
          </a>
        )}
        {!license.url && license.text}
        {license.icons.map(icon => (
          <Icon key={icon} name={icon} />
        ))}
      </span>
    </>
  );
};

export default License;
