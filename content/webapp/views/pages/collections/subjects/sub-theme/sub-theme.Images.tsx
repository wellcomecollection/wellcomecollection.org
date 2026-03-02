import { useMemo } from 'react';
import styled from 'styled-components';

import { pluralize } from '@weco/common/utils/grammar';
import { ReturnedResults } from '@weco/common/utils/search';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';
import { Image as ImageType } from '@weco/content/services/wellcome/catalogue/types';
import CatalogueImageGallery from '@weco/content/views/components/CatalogueImageGallery';
import MoreLink from '@weco/content/views/components/MoreLink';
import { toSearchImagesLink } from '@weco/content/views/components/SearchPagesLink/Images';

const ThemeImagesWrapper = styled.div`
  background-color: ${props => props.theme.color('neutral.700')};
`;

const SubThemeImages = ({
  subThemeName,
  images,
  conceptsDisplayLabels,
}: {
  subThemeName: string;
  images: ReturnedResults<ImageType>;
  conceptsDisplayLabels: string[];
}) => {
  const firstTenImages = useMemo(
    () => images.pageResults.slice(0, 10) || [],
    [images]
  );

  return (
    <ThemeImagesWrapper>
      <CatalogueImageGallery
        // Show the first 10 images, unless the total is 12 or fewer, in which case show all images
        images={images.totalResults > 12 ? firstTenImages : images.pageResults}
        detailsCopy={`${pluralize(images.totalResults, 'image')} from works`}
        variant="scrollable"
      />

      <Space $v={{ size: 'md', properties: ['margin-top'] }}>
        <MoreLink
          ariaLabel={`View all images about ${subThemeName}`}
          name="View all"
          url={toSearchImagesLink({
            'source.subjects.label': conceptsDisplayLabels,
          })}
          colors={themeValues.buttonColors.greenGreenWhite}
        />
      </Space>
    </ThemeImagesWrapper>
  );
};

export default SubThemeImages;
