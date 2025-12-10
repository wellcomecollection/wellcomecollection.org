import { FunctionComponent, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { capitalize, pluralize } from '@weco/common/utils/grammar';
import { ReturnedResults } from '@weco/common/utils/search';
import Space from '@weco/common/views/components/styled/Space';
import { useConceptPageContext } from '@weco/content/contexts/ConceptPageContext';
import {
  Concept,
  Image,
} from '@weco/content/services/wellcome/catalogue/types';
import { allRecordsLinkParams } from '@weco/content/utils/concepts';
import CatalogueImageGallery from '@weco/content/views/components/CatalogueImageGallery';
import MoreLink from '@weco/content/views/components/MoreLink';
import { toSearchImagesLink } from '@weco/content/views/components/SearchPagesLink/Images';

import {
  getSectionTypeLabel,
  SectionData,
  ThemePageSectionsData,
  themeTabOrder,
  ThemeTabType,
} from './concept.helpers';
import { FromCollectionsHeading } from './concept.styles';

const ThemeImagesWrapper = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-bottom'] },
})`
  background-color: ${props => props.theme.color('neutral.700')};
`;

const SectionHeading = styled(Space).attrs({
  as: 'h3',
  className: font('sans-bold', 1),
  $v: { size: 'xs', properties: ['margin-bottom'] },
})`
  color: ${props => props.theme.color('white')};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const getAllImagesLink = (tab: ThemeTabType, concept: Concept) => {
  const sectionName = `images${capitalize(tab)}`;
  return toSearchImagesLink(allRecordsLinkParams(sectionName, concept));
};

type Props = {
  singleSectionData?: ReturnedResults<Image>;
  labelBasedCount: number;
  concept: Concept;
  type: ThemeTabType;
};

const ImageSection: FunctionComponent<Props> = ({
  singleSectionData,
  labelBasedCount,
  concept,
  type,
}) => {
  const theme = useTheme();
  const { config } = useConceptPageContext();
  const firstTenImages = useMemo(
    () => singleSectionData?.pageResults.slice(0, 10) || [],
    [singleSectionData]
  );

  if (!singleSectionData || singleSectionData.pageResults.length === 0) {
    return null;
  }

  return (
    <Space $v={{ size: 'md', properties: ['padding-top'] }}>
      <SectionHeading id={`images-${type}`}>
        {getSectionTypeLabel(type, config, 'images')}
      </SectionHeading>
      <CatalogueImageGallery
        // Show the first 10 images, unless the total is 12 or fewer, in which case show all images
        images={
          singleSectionData.totalResults > 12
            ? firstTenImages
            : singleSectionData.pageResults
        }
        label={`${pluralize(singleSectionData.totalResults, 'image')} from works`}
        variant="scrollable"
      />
      <Space
        $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}
        style={{ position: 'relative' }} // relative to allow 'View all' button focus to stack above element that would otherwise clip it off
      >
        {labelBasedCount > singleSectionData.pageResults.length && (
          <MoreLink
            ariaLabel={`View all ${getSectionTypeLabel(type, config, 'images')}`}
            name="View all"
            url={getAllImagesLink(type, concept)}
            colors={theme.buttonColors.greenGreenWhite}
          />
        )}
      </Space>
    </Space>
  );
};

const ImagesResults: FunctionComponent<{
  sectionsData: ThemePageSectionsData;
  concept: Concept;
}> = ({ sectionsData, concept }) => {
  const isSectionEmpty = (section: SectionData) => {
    return !section.images || section.images.totalResults === 0;
  };

  if (themeTabOrder.every(tab => isSectionEmpty(sectionsData[tab]))) {
    return null;
  }

  return (
    <>
      <ThemeImagesWrapper
        as="section"
        data-testid="images-section"
        data-id="images"
      >
        <Space $v={{ size: 'sm', properties: ['padding-top'] }}>
          <FromCollectionsHeading $color="white" id="images">
            Images from the collections
          </FromCollectionsHeading>
        </Space>
        {themeTabOrder.map(tabType => (
          <ImageSection
            key={tabType}
            singleSectionData={sectionsData[tabType].images}
            labelBasedCount={sectionsData[tabType].totalResults.images!}
            concept={concept}
            type={tabType}
          />
        ))}
      </ThemeImagesWrapper>
    </>
  );
};
export default ImagesResults;
