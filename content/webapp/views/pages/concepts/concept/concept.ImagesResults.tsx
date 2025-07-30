import { usePathname } from 'next/navigation';
import { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';

import { ImagesLinkSource } from '@weco/common/data/segment-values';
import { font } from '@weco/common/utils/classnames';
import { capitalize, pluralize } from '@weco/common/utils/grammar';
import { ReturnedResults } from '@weco/common/utils/search';
import Space from '@weco/common/views/components/styled/Space';
import theme from '@weco/common/views/themes/default';
import { useConceptPageContext } from '@weco/content/contexts/ConceptPageContext';
import {
  Concept,
  Image,
} from '@weco/content/services/wellcome/catalogue/types';
import { allRecordsLinkParams } from '@weco/content/utils/concepts';
import CatalogueImageGallery from '@weco/content/views/components/CatalogueImageGallery';
import MoreLink from '@weco/content/views/components/MoreLink';
import { toLink as toImagesLink } from '@weco/content/views/components/SearchPagesLink/Images';

import {
  getSectionTypeLabel,
  getThemeSectionHeading,
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
  className: font('intsb', 3),
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  color: ${props => props.theme.color('white')};
`;

const getAllImagesLink = (
  tab: ThemeTabType,
  concept: Concept,
  pathname: string
) => {
  const linkSource = `concept/images_${tab}_${pathname}` as ImagesLinkSource;
  const sectionName = `images${capitalize(tab)}`;
  return toImagesLink(allRecordsLinkParams(sectionName, concept), linkSource);
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
  const { config } = useConceptPageContext();
  const pathname = usePathname();
  const firstTenImages = useMemo(
    () => singleSectionData?.pageResults.slice(0, 10) || [],
    [singleSectionData]
  );

  if (!singleSectionData || singleSectionData.pageResults.length === 0) {
    return null;
  }

  return (
    <Space
      $v={{ size: 'l', properties: ['padding-top'] }}
      as="section"
      data-id={`images-${type}`}
    >
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
      <Space $v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
        {labelBasedCount > singleSectionData.pageResults.length && (
          <MoreLink
            name={`All images ${getThemeSectionHeading(type, concept)}`}
            url={getAllImagesLink(type, concept, pathname)}
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
      <ThemeImagesWrapper data-testid="images-section">
        <Space $v={{ size: 'm', properties: ['padding-top'] }}>
          <FromCollectionsHeading $color="white">
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
