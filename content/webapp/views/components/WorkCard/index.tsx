import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import LabelsList from '@weco/common/views/components/LabelsList';
import Space from '@weco/common/views/components/styled/Space';

const PopoutCardImageContainer = styled.div<{ $aspectRatio?: number }>`
  position: relative;
  width: 100%;
  background-color: ${props => props.theme.color('neutral.300')};
  padding-top: ${props =>
    props.$aspectRatio ? `${props.$aspectRatio * 66}%` : '100%'};
  transform: rotate(-2deg);
`;

const PopoutCardImage = styled(Space).attrs({
  $v: { size: 'l', properties: ['bottom'] },
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

  ${props => props.theme.media('medium')`
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
  className: font('intb', 5),
})`
  margin: 0;
`;

const Meta = styled.p.attrs({
  className: font('intr', 6),
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
    alt?: string;
  };
  labels: { text: string }[];
  meta?: string;
};

type Props = {
  item: WorkItem;
};

const WorkCard: FunctionComponent<Props> = ({ item }) => {
  const { url, title, image, labels, meta } = item;
  const aspectRatio = image.height / image.width;
  return (
    <LinkSpace $url={url} data-component="work-card">
      <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
        <PopoutCardImageContainer
          data-component="popout-image"
          $aspectRatio={aspectRatio}
        >
          <PopoutCardImage>
            <img
              src={image.contentUrl}
              alt=""
              loading="lazy"
              height={image.height}
              width={image.width}
            />
          </PopoutCardImage>
        </PopoutCardImageContainer>
        <Space
          $v={{ size: 's', properties: ['margin-bottom'] }}
          style={{ position: 'relative' }}
        >
          <Space $v={{ size: 'm', properties: ['margin-top'], negative: true }}>
            <LabelsList labels={labels} />
          </Space>
        </Space>
        <Title>{title}</Title>
        {meta && <Meta>{meta}</Meta>}
      </Space>
    </LinkSpace>
  );
};

export default WorkCard;
