import { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';

import { DigitalLocation } from '@weco/common/model/catalogue';
import { font } from '@weco/common/utils/classnames';
import { pluralize } from '@weco/common/utils/grammar';
import Space from '@weco/common/views/components/styled/Space';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import CatalogueImageGallery from '@weco/content/views/components/CatalogueImageGallery';

const SectionHeading = styled(Space).attrs({
  as: 'h3',
  className: font('sans-bold', 1),
  $v: { size: 'xs', properties: ['margin-bottom'] },
})`
  color: ${props => props.theme.color('white')};
`;

function toImages(portraitImages: DigitalLocation[]): Image[] {
  return portraitImages.map((location, index) => ({
    type: 'Image' as const,
    id: `portrait-${index}`,
    locations: [location],
    source: {
      id: '',
      title: '',
      type: 'Work',
    },
  }));
}

const PortraitImages: FunctionComponent<{
  portraitImages: DigitalLocation[];
  displayLabel: string;
}> = ({ portraitImages, displayLabel }) => {
  const images = useMemo(() => toImages(portraitImages), [portraitImages]);

  if (portraitImages.length === 0) {
    return null;
  }

  return (
    <Space $v={{ size: 'md', properties: ['padding-top'] }}>
      <SectionHeading id="portrait-images">
        Portraits of {displayLabel}
      </SectionHeading>
      <CatalogueImageGallery
        images={images}
        detailsCopy={pluralize(images.length, 'image')}
        variant="scrollable"
      />
    </Space>
  );
};

export default PortraitImages;
