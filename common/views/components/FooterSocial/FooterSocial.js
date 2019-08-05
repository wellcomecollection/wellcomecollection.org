// @flow
import { font, classNames } from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import VerticalSpace from '../styled/VerticalSpace';

const items = [
  {
    url: 'https://twitter.com/explorewellcome',
    title: 'Twitter',
    service: 'Twitter',
    icon: 'twitter',
  },
  {
    url: 'https://www.facebook.com/wellcomecollection/',
    title: 'Facebook',
    service: 'Facebook',
    icon: 'facebook',
  },
  {
    url: 'https://www.instagram.com/wellcomecollection/',
    title: 'Instagram',
    service: 'Instagram',
    icon: 'instagram',
  },
  {
    url: 'https://soundcloud.com/wellcomecollection',
    title: 'Soundcloud',
    service: 'Soundcloud',
    icon: 'soundcloud',
  },
  {
    url: 'https://www.youtube.com/user/WellcomeCollection',
    title: 'YouTube',
    service: 'YouTube',
    icon: 'youtube',
  },
  {
    url:
      'https://www.tripadvisor.co.uk/Attraction_Review-g186338-d662065-Reviews-Wellcome_Collection-London_England.html',
    title: 'TripAdvisor',
    service: 'TripAdvisor',
    icon: 'tripadvisor',
  },
];

const FooterSocial = () => (
  <VerticalSpace
    size="m"
    properties={['margin-top']}
    className={classNames({
      'footer-social': true,
    })}
  >
    {items.map(item => (
      <div key={item.title} className="footer-social__cell">
        <VerticalSpace
          as="a"
          size="l"
          className={`footer-social__link ${font('hnm', 6)}`}
          href={item.url}
        >
          <Icon name={item.icon} extraClasses="margin-right-6" />
          <span className="footer-social__title">{item.title}</span>
          <span className="footer-social__service">{item.service}</span>
        </VerticalSpace>
      </div>
    ))}
  </VerticalSpace>
);

export default FooterSocial;
