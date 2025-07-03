import { FunctionComponent } from 'react';
import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';
import ThemeImagesSection from '@weco/content/components/ThemeImages/ThemeImagesSection';
import { themeTabOrder } from '@weco/content/components/ThemeWorks';
import {
  SectionData,
  ThemePageSectionsData,
} from '@weco/content/pages/concepts/[conceptId]';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';

const ThemeImagesWrapper = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-bottom'] },
})`
  background-color: ${props => props.theme.color('neutral.700')};
`;

type Props = {
  sectionsData: ThemePageSectionsData;
  concept: Concept;
};

const isSectionEmpty = (section: SectionData) => {
  return !section.images || section.images.totalResults === 0;
};

const ThemeImages: FunctionComponent<Props> = ({ sectionsData, concept }) => {
  if (themeTabOrder.every(tab => isSectionEmpty(sectionsData[tab]))) {
    return null;
  }

  return (
    <>
      <ThemeImagesWrapper as="section" data-testid="images-section">
        {themeTabOrder.map(tabType => (
          <ThemeImagesSection
            key={tabType}
            singleSectionData={sectionsData[tabType].images}
            totalResults={sectionsData[tabType].totalResults.images!}
            concept={concept}
            type={tabType}
          />
        ))}
      </ThemeImagesWrapper>
    </>
  );
};
export default ThemeImages;
