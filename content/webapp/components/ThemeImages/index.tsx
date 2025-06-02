import { FunctionComponent } from 'react';

import Space from '@weco/common/views/components/styled/Space';
import { Container } from '@weco/common/views/components/styled/Container';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';
import styled from 'styled-components';
import {
  SectionData,
  ThemePageSectionsData,
} from '../../pages/concepts/[conceptId]';
import ThemeImagesSection from './ThemeImagesSection';
import { Concept } from '../../services/wellcome/catalogue/types';
import { themeTabOrder } from '../ThemeWorks';

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
  if (
    isSectionEmpty(sectionsData.about) &&
    isSectionEmpty(sectionsData.by) &&
    isSectionEmpty(sectionsData.in)
  ) {
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
