import { useMemo } from 'react';
import styled from 'styled-components';

import { pluralize } from '@weco/common/utils/grammar';
import { ReturnedResults } from '@weco/common/utils/search';
import Space from '@weco/common/views/components/styled/Space';
import { Image as ImageType } from '@weco/content/services/wellcome/catalogue/types';
import CatalogueImageGallery from '@weco/content/views/components/CatalogueImageGallery';

const ThemeImagesWrapper = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-bottom'] },
})`
  background-color: ${props => props.theme.color('neutral.700')};
`;

const SubThemeImages = ({ images }: { images: ReturnedResults<ImageType> }) => {
  const firstTenImages = useMemo(
    () => images.pageResults.slice(0, 10) || [],
    [images]
  );

  /* TODO this doesn't work within the container. */
  return (
    <ThemeImagesWrapper>
      <CatalogueImageGallery
        // Show the first 10 images, unless the total is 12 or fewer, in which case show all images
        images={images.totalResults > 12 ? firstTenImages : images.pageResults}
        detailsCopy={`${pluralize(images.totalResults, 'image')} from works`}
        variant="scrollable"
      />

      {/* TODO add View more button, but where does it point to when it's a high-level concept? */}
    </ThemeImagesWrapper>
  );
};

export default SubThemeImages;
