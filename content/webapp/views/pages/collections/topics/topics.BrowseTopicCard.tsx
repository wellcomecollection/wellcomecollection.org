import Link from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import Space from '@weco/common/views/components/styled/Space';
import { topicDescriptions } from '@weco/content/data/browse/topics';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';
import ImagePlaceholder from '@weco/content/views/components/ImagePlaceholder';

const CardLink = styled(Link)`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.color('warmNeutral.300')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  overflow: hidden;
  text-decoration: none;
  color: ${props => props.theme.color('black')};
  transition: transform 200ms ease;

  &:hover,
  &:focus {
    transform: translateY(-2px);

    h3 {
      text-decoration: underline;
      text-decoration-color: ${props => props.theme.color('black')};
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: ${props => props.theme.color('neutral.700')};
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ContentWrapper = styled(Space).attrs({
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3.attrs({
  className: font('brand', 1),
})`
  margin: 0 0 ${props => props.theme.spacingUnit}px 0;
`;

const Description = styled.p.attrs({
  className: font('sans', -1),
})`
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
`;

type ConceptWithImage = Concept & {
  image?: {
    locations: { url: string }[];
    alternativeText?: string;
  };
};

type Props = {
  topic: ConceptWithImage;
};

const BrowseTopicCard: FunctionComponent<Props> = ({ topic }) => {
  const url = `/collections/topics/${topic.id}`;
  // Check if topic has image data (added dynamically in BrowseTopicsGrid)
  const hasImage =
    topic.image && topic.image.locations && topic.image.locations.length > 0;

  // Convert IIIF image URL to proper format
  const getImageSrc = () => {
    if (!hasImage || !topic.image) return null;

    const imageLocation = topic.image.locations[0];
    if (imageLocation.url.includes('/info.json')) {
      // Use iiifImageTemplate for IIIF images
      const imageTemplate = iiifImageTemplate(imageLocation.url);
      return imageTemplate({
        size: '400,',
        quality: 'default',
        format: 'jpg',
      });
    }
    return imageLocation.url;
  };

  const imageSrc = getImageSrc();

  return (
    <CardLink href={url} data-component="browse-topic-card">
      <ImageContainer>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={topic.image?.alternativeText || topic.label}
            loading="lazy"
          />
        ) : (
          <ImagePlaceholder backgroundColor="accent.purple" />
        )}
      </ImageContainer>

      <ContentWrapper>
        <Title>{topic.label}</Title>
        <Description>{topicDescriptions[topic.label]}</Description>
      </ContentWrapper>
    </CardLink>
  );
};

export default BrowseTopicCard;
