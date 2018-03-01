// @flow
import {font} from '../../../utils/classnames';
import Icon from '../Icon/Icon';

type SocialLink = {|
  url: string,
  title: string,
  service: string,
  icon: string
|}

type Props = {|
  items: Array<SocialLink>
|}

const FooterSocial = ({items}: Props) => (
  <div className='footer-social'>
    {items.map((item) => (
      <div key={item.title} className='footer-social__cell'>
        <a className={`footer-social__link ${font({s: 'HNM6'})}`} href={item.url}>
          <Icon name={item.icon} extraClasses='margin-right-s1' />
          <span className='footer-social__title'>{item.title}</span>
          <span className='footer-social__service'>{item.service}</span>
        </a>
      </div>
    ))}
  </div>
);

export default FooterSocial;
