// @flow
import getLicenseInfo from '../../../utils/get-license-info';
import {spacing, font} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import type {LicenseType} from '../../../model/license';
import type {LicenseData} from '../../../utils/get-license-info';

type Props = {|
  subject: string,
  licenseType: LicenseType
|}

function renderIcons(icons) {
  if (icons) {
    return icons.map((i) => (
      <Icon key={i} name={i} extraClasses='v-align-middle margin-right-s1' />
    ));
  }
}

function renderLicenseLink(url: ?string, icons: ?string[], text: string) {
  if (url) {
    return (
      <a className={`flex ${font({s: 'LR2'})}`} rel='license' href={url}>
        {renderIcons(icons)}
        {text}
      </a>
    );
  } else {
    return (
      <span className={`flex ${font({s: 'LR2'})}`}>
        {renderIcons(icons)}
        <span>{text}</span>
      </span>
    );
  }
}

const License = ({subject, licenseType}: Props) => {
  const licenseInfo: LicenseData = getLicenseInfo(licenseType) || { text: '', humanReadableText: [''] };
  return (
    <div className='plain-text'>
      {licenseInfo.description &&
        <div className={spacing({s: 2}, {margin: ['bottom']})}>
          <p className={`${font({s: 'HNL5', m: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})}`}>{licenseInfo.description}</p>
        </div>
      }
      <span className={`${font({s: 'LR2'})}`} about={subject}>
        {renderLicenseLink(licenseInfo.url, licenseInfo.icons, licenseInfo.text)}
      </span>
    </div>
  );
};

export default License;
