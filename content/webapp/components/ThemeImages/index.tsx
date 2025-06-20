import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';
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
      <WobblyEdge backgroundColor="neutral.700" />
      <ThemeImagesWrapper as="section" data-testid="images-section">
        <Container>
          {themeTabOrder.map(tabType => (
            <ThemeImagesSection
              key={tabType}
              singleSectionData={sectionsData[tabType].images}
              totalResults={sectionsData[tabType].totalResults.images!}
              concept={concept}
              type={tabType}
            />
          ))}
        </Container>
      </ThemeImagesWrapper>
    </>
  );
};
export default ThemeImages;
