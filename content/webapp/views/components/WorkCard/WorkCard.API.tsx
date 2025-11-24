import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import LabelsList from '@weco/common/views/components/LabelsList';
import Space from '@weco/common/views/components/styled/Space';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';

// Ensures the image container takes up the same amount of vertical space
// regardless of the image height
const Shim = styled.div`
  position: relative;
  ${props => props.theme.media('medium')`
    height: 0;
    padding-top: 100%;
  `}
`;

const PopoutCardImageContainer = styled.div<{ $aspectRatio?: number }>`
  position: relative;
  ${props => props.theme.media('medium')`
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
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
`;

const Meta = styled.p.attrs({
  className: font('intr', 6),
})`
  color: ${props => props.theme.color('neutral.600')};
  margin: 0;
`;

const NotAvailable = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

type Props = {
  item: WorkBasic;
};

const WorkCard: FunctionComponent<Props> = ({ item }) => {
  const transformedWork = {
    title: item.title,
    url: '/works/' + item.id,
    // `cardLabels` contains `workType` and `availabilities`, adding a labelColor to the latter.
    // As we only want the workType here, we filter out any with a labelColor.
    // It's not ideal but I prefer that to modifying a transformer that's heavily used elsewhere.
    labels:
      item.cardLabels?.length > 0 && !item.cardLabels[0].labelColor
        ? [{ text: item.cardLabels[0].text }]
        : [],
    image: {
      url: item.thumbnail
        ? convertIiifImageUri(item.thumbnail.url, 120)
        : undefined,
    }, // TODO
    partOf: item.archiveLabels?.partOf,
    contributor: item.primaryContributorLabel,
    date: item.productionDates[0],
  };

  return (
    <LinkSpace $url={transformedWork.url} data-component="work-card">
      <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
        <Shim>
          <PopoutCardImageContainer
            data-component="popout-image"
            // $aspectRatio={aspectRatio}
          >
            {transformedWork.image.url ? (
              <PopoutCardImage>
                {/* <IIIFImage image={transformedWork.image} layout="raw" /> */}
                <img
                  alt=""
                  src={convertIiifImageUri(transformedWork.image.url, 500)}
                />
              </PopoutCardImage>
            ) : (
              <NotAvailable>Preview not available</NotAvailable>
            )}
          </PopoutCardImageContainer>
        </Shim>

        <Space
          $v={{ size: 's', properties: ['margin-bottom'] }}
          style={{ position: 'relative' }}
        >
          <Space $v={{ size: 'm', properties: ['margin-top'], negative: true }}>
            <LabelsList labels={transformedWork.labels} />
          </Space>
        </Space>
        <Title>{transformedWork.title}</Title>

        {transformedWork.partOf && (
          <Meta>Part of: {transformedWork.partOf}</Meta>
        )}
        {transformedWork.contributor && (
          <Meta>{transformedWork.contributor}</Meta>
        )}
        {transformedWork.date && <Meta>Date: {transformedWork.date}</Meta>}
      </Space>
    </LinkSpace>
  );
};

export default WorkCard;
