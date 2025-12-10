// Delete when newOnlineListingPage becomes default
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import LabelsList from '@weco/common/views/components/LabelsList';
import Space from '@weco/common/views/components/styled/Space';
import IIIFImage from '@weco/content/views/components/IIIFImage';

// Ensures the image container takes up the same amount of vertical space
// regardless of the image height
const Shim = styled.div`
  position: relative;
  ${props => props.theme.media('sm')`
    height: 0;
    padding-top: 100%;
  `}
`;

const PopoutCardImageContainer = styled.div<{ $aspectRatio?: number }>`
  position: relative;
  ${props => props.theme.media('sm')`
    position: absolute;
    bottom: 0;
  `}
  width: 100%;
  background-color: ${props => props.theme.color('neutral.300')};
  padding-top: ${props =>
    props.$aspectRatio ? `${props.$aspectRatio * 66}%` : '100%'};
  transform: rotate(-2deg);
`;

const PopoutCardImage = styled(Space).attrs({
  $v: { size: 'md', properties: ['bottom'] },
})`
  position: absolute;
  width: 66%;
  left: 50%;
  transform: translateX(-50%) rotate(2deg);
`;

type LinkSpaceAttrs = {
  $url: string;
};

const LinkSpace = styled(Space).attrs<LinkSpaceAttrs>(props => ({
  as: 'a',
  href: props.$url,
}))<LinkSpaceAttrs>`
  display: block;
  margin-top: 40px;

  ${props => props.theme.media('sm')`
    margin-top: 0;
  `}

  &,
  &:link,
  &:visited {
    text-decoration: none;
    border: none;
  }

  &:hover h3,
  &:focus h3 {
    text-decoration: underline;
    text-decoration-color: ${props => props.theme.color('black')};
  }
`;

const Title = styled.h3.attrs({
  className: font('sans-bold', -1),
})`
  margin: 0;
`;

const Meta = styled.p.attrs({
  className: font('sans', -2),
})`
  color: ${props => props.theme.color('neutral.600')};
  margin: 0;
  white-space: nowrap;
`;

export type WorkItem = {
  url: string;
  title: string;
  image: {
    contentUrl: string;
    width: number;
    height: number;
    alt: string | null;
  };
  labels: { text: string }[];
  partOf?: string;
  contributor?: string;
  date?: string;
};

type Props = {
  item: WorkItem;
};

const WorkCard: FunctionComponent<Props> = ({ item }) => {
  const { url, title, image, labels, partOf, contributor, date } = item;
  const aspectRatio = image.height / image.width;

  return (
    <LinkSpace $url={url} data-component="work-card">
      <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
        <Shim>
          <PopoutCardImageContainer
            data-component="popout-image"
            $aspectRatio={aspectRatio}
          >
            <PopoutCardImage>
              <IIIFImage image={image} layout="raw" />
            </PopoutCardImage>
          </PopoutCardImageContainer>
        </Shim>
        <Space
          $v={{ size: 'xs', properties: ['margin-bottom'] }}
          style={{ position: 'relative' }}
        >
          <Space
            $v={{ size: 'sm', properties: ['margin-top'], negative: true }}
          >
            <LabelsList labels={labels} />
          </Space>
        </Space>
        <Title>{title}</Title>

        {partOf && <Meta>Part of: {partOf}</Meta>}
        {contributor && <Meta>{contributor}</Meta>}
        {date && <Meta>Date: {date}</Meta>}
      </Space>
    </LinkSpace>
  );
};

export default WorkCard;
