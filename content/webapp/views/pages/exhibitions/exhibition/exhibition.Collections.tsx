import styled from 'styled-components';

import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { AboutThisExhibitionContent } from '@weco/content/types/exhibitions';
import SectionHeader from '@weco/content/views/components/SectionHeader';

export const Wrapper = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
  as: 'section',
})`
  background: ${props => props.theme.color('warmNeutral.300')};
`;

const ExhibitionCollectionsContent = ({
  isTendernessAndRageExhibition,
  conceptIds,
  videos,
  aboutThisExhibitionContent,
}: {
  isTendernessAndRageExhibition: boolean;
  conceptIds: string[];
  videos: string[];
  aboutThisExhibitionContent: AboutThisExhibitionContent[];
}) => {
  // For now, we only want to trial displaying stories here for the Tenderness and Rage exhibition.
  // If this trial is successful, we will want to expand this to other exhibitions in the future.
  const shouldDisplayStories =
    isTendernessAndRageExhibition && aboutThisExhibitionContent.length > 0;

  const shouldDisplay =
    shouldDisplayStories || conceptIds.length > 0 || videos.length > 0;

  if (!shouldDisplay) return null;

  return (
    <Wrapper>
      <Container>
        <SectionHeader title="Further reading" />
        <p>
          Explore the subjects and stories inspired by the topics in the
          exhibition
        </p>

        {shouldDisplayStories && <p>Stories section</p>}

        {conceptIds.length > 0 && <p>Concepts section</p>}

        {videos.length > 0 && <p>Videos section</p>}
      </Container>
    </Wrapper>
  );
};

export default ExhibitionCollectionsContent;
