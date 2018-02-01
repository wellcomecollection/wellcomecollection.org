import getLicenseInfo from '../../../utils/get-license-info';
import {spacing, font} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import LicenseType from '../../../model/license';

type Props = {|
  subject: string,
  licenseType: LicenseType
|}

function renderIcons(icons) {
  return icons.map((i) => (
    <Icon key={i} name={i} extraClasses={['v-align-middle', 'margin-right-s1']} />
  ));
};

function renderLicenseLink(url, icons, text) {
  if (url) {
   return (
      <a className={`flex plain-link ${font({s:'LR2'})}`} rel='license' href={url}>
        {renderIcons(icons)}
        <span className='link-underline'>{text}</span>
      </a>
   )
  } else {
    return (
      <span className={`flex ${font({s:'LR2'})}`}>
        {renderIcons(icons)}
        <span>{text}</span>
      </span>
    )
  }
}

export default ({subject, licenseType}: Props) => {
  const licenseInfo = getLicenseInfo(licenseType) ? getLicenseInfo(licenseType) : {};
  return (
    <div>
      {licenseInfo.description &&
        <div className={spacing({s: 2}, {margin: ['bottom']})}>
          <p className={`${font({s:'HNL5' , m:'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})}`}>{licenseInfo.description}</p>
        </div>
      }
      <span className={`${font({s:'LR2'})}`} about={subject}>
        {renderLicenseLink(licenseInfo.url, licenseInfo.icons, licenseInfo.text)}
      </span>
      </div>
    );
  };
