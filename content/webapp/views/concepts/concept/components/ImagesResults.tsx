import { usePathname } from 'next/navigation';
import { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';

import { ImagesLinkSource } from '@weco/common/data/segment-values';
import { font } from '@weco/common/utils/classnames';
import {
  capitalize,
  formatNumber,
  pluralize,
} from '@weco/common/utils/grammar';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';
import theme from '@weco/common/views/themes/default';
import CatalogueImageGallery from '@weco/content/components/CatalogueImageGallery';
import MoreLink from '@weco/content/components/MoreLink';
import { toLink as toImagesLink } from '@weco/content/components/SearchPagesLink/Images';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';
import { allRecordsLinkParams } from '@weco/content/utils/concepts';
import {
  getThemeTabLabel,
  SectionData,
  ThemePageSectionsData,
  themeTabOrder,
  ThemeTabType,
} from '@weco/content/views/concepts/concept/helpers';

const getAllImagesLink = (
  tab: ThemeTabType,
  concept: Concept,
  pathname: string
) => {
  const linkSource = `concept/images_${tab}_${pathname}` as ImagesLinkSource;
  const sectionName = `images${capitalize(tab)}`;
  return toImagesLink(allRecordsLinkParams(sectionName, concept), linkSource);
};

const SectionHeading = styled(Space).attrs({
  as: 'h3',
  className: font('intsb', 2),
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  color: ${props => props.theme.color('white')};
`;

const ImagesResultsWrapper = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-bottom'] },
})`
  background-color: ${props => props.theme.color('neutral.700')};
`;

const isSectionEmpty = (section: SectionData) => {
  return !section.images || section.images.totalResults === 0;
};

const ImagesResults: FunctionComponent<{
  sectionsData: ThemePageSectionsData;
  concept: Concept;
}> = ({ sectionsData, concept }) => {
  const pathname = usePathname();
  const singleSectionData = sectionsData[themeTabOrder[0]].images;

  const firstTenImages = useMemo(
    () => singleSectionData?.pageResults.slice(0, 10) || [],
    [singleSectionData]
  );

  if (themeTabOrder.every(tab => isSectionEmpty(sectionsData[tab]))) {
    return null;
  }

  if (!singleSectionData || singleSectionData.pageResults.length === 0) {
    return null;
  }

  return (
    <>
      <WobblyEdge backgroundColor="neutral.700" />
      <ImagesResultsWrapper as="section" data-testid="images-section">
        <Container>
          {themeTabOrder.map(tabType => {
            const totalResults = sectionsData[tabType].totalResults.images!;
            const formattedTotalCount = formatNumber(totalResults, {
              isCompact: true,
            });

            return (
              <Space
                key={tabType}
                $v={{ size: 'l', properties: ['padding-top'] }}
              >
                <SectionHeading>
                  Images {getThemeTabLabel(tabType, concept.type)}{' '}
                  {concept.label}
                </SectionHeading>

                <CatalogueImageGallery
                  variant="scrollable"
                  // Show the first 10 images, unless the total is 12 or fewer, in which case show all images
                  images={
                    totalResults > 12
                      ? firstTenImages
                      : singleSectionData.pageResults
                  }
                  label={`${pluralize(totalResults, 'image')} from works`}
                />

                <Space $v={{ size: 'l', properties: ['margin-top'] }}>
                  {singleSectionData.totalResults >
                    singleSectionData.pageResults.length && (
                    <MoreLink
                      name={`All images ${getThemeTabLabel(tabType, concept.type)} (${formattedTotalCount})`}
                      url={getAllImagesLink(tabType, concept, pathname)}
                      colors={theme.buttonColors.greenGreenWhite}
                    />
                  )}
                </Space>
              </Space>
            );
          })}
        </Container>
      </ImagesResultsWrapper>
    </>
  );
};
export default ImagesResults;
