import { FunctionComponent } from 'react';

import Space from '@weco/common/views/components/styled/Space';
import { Container } from '@weco/common/views/components/styled/Container';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';
import styled from 'styled-components';
import { ThemePageSectionsData } from '../../pages/concepts/[conceptId]';
import ThemeImagesSection from './ThemeImagesSection';

const ThemeImagesWrapper = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('neutral.700')};
`;

type Props = {
  sectionsData: ThemePageSectionsData;
};

const ThemeImages: FunctionComponent<Props> = ({ sectionsData }) => {
  return (
    <>
      <WobblyEdge backgroundColor="neutral.700" />
      <ThemeImagesWrapper as="section" data-testid="images-section">
        <Container>
          <ThemeImagesSection
            singleSectionData={sectionsData.by.images}
            type="by"
          />
          <ThemeImagesSection
            singleSectionData={sectionsData.about.images}
            type="featuring"
          />
          <ThemeImagesSection
            singleSectionData={sectionsData.in.images}
            type="in"
          />
        </Container>
      </ThemeImagesWrapper>
    </>
  );
};
export default ThemeImages;
