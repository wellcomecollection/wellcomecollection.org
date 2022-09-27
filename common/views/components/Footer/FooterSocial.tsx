import {
  facebook,
  instagram,
  soundcloud,
  tripadvisor,
  twitter,
  youtube,
  IconSvg,
} from '@weco/common/icons';
import { font } from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';
import styled from 'styled-components';
import { FC } from 'react';

const Wrapper = styled(Space).attrs({
  v: {
    size: 'm',
    properties: ['margin-top'],
  },
})`
  display: flex;
  flex-wrap: wrap;

  ${props => props.theme.media.xlarge`
    justify-content: space-between;
    flex-wrap: nowrap;
  `}
`;

const Cell = styled.div`
  flex-basis: 100%;
  min-width: 100%;

  ${props => props.theme.media.medium`
    flex-basis: 50%;
    min-width: 50%;
  `}

  ${props => props.theme.media.large`
    flex-basis: 25%;
    min-width: 25%;
  `}

  ${props => props.theme.media.xlarge`
    flex-basis: auto;
    min-width: 0;
  `}
`;

type LinkProps = {
  href: string;
};

const Link = styled(Space).attrs({
  v: {
    size: 'l',
    properties: ['margin-bottom'],
  },
  as: 'a',
  className: font('intb', 6),
})<LinkProps>`
  color: ${props => props.theme.color('white')};
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: color 200ms ease;

  &:hover,
  &:focus {
    color: ${props => props.theme.color('accent.green')};
  }
`;

type SocialItem = {
  url: string;
  title: string;
  service: string;
  icon: IconSvg;
};

const items: SocialItem[] = [
  {
    url: 'https://twitter.com/explorewellcome',
    title: 'Twitter',
    service: 'Twitter',
    icon: twitter,
  },
  {
    url: 'https://www.facebook.com/wellcomecollection/',
    title: 'Facebook',
    service: 'Facebook',
    icon: facebook,
  },
  {
    url: 'https://www.instagram.com/wellcomecollection/',
    title: 'Instagram',
    service: 'Instagram',
    icon: instagram,
  },
  {
    url: 'https://soundcloud.com/wellcomecollection',
    title: 'SoundCloud',
    service: 'SoundCloud',
    icon: soundcloud,
  },
  {
    url: 'https://www.youtube.com/user/WellcomeCollection',
    title: 'YouTube',
    service: 'YouTube',
    icon: youtube,
  },
  {
    url: 'https://www.tripadvisor.co.uk/Attraction_Review-g186338-d662065-Reviews-Wellcome_Collection-London_England.html',
    title: 'Tripadvisor',
    service: 'Tripadvisor',
    icon: tripadvisor,
  },
];

const FooterSocial: FC = () => (
  <Wrapper>
    {items.map(item => (
      <Cell key={item.title}>
        <Link href={item.url}>
          <Space as="span" h={{ size: 's', properties: ['margin-right'] }}>
            <Icon icon={item.icon} color="currentColor" />
          </Space>
          <span>{item.title}</span>
          <span className="visually-hidden">{item.service}</span>
        </Link>
      </Cell>
    ))}
  </Wrapper>
);

export default FooterSocial;
