import styled from 'styled-components';

import { ThemeCardsListSlice as RawThemeCardsListSlice } from '@weco/common/prismicio-types';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { transformThemeCardsList } from '@weco/content/services/prismic/transformers/body';
import { AboutThisExhibitionContent } from '@weco/content/types/exhibitions';
import SectionHeader from '@weco/content/views/components/SectionHeader';
import ThemeCardsList from '@weco/content/views/components/ThemeCardsList';

export const Wrapper = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
  as: 'section',
})`
  background: ${props => props.theme.color('warmNeutral.300')};
`;
const ExhibitionCollectionsContent = ({
  isTendernessAndRageExhibition,
  rawThemeCardsListSlice,
  videos,
  aboutThisExhibitionContent,
}: {
  isTendernessAndRageExhibition: boolean;
  rawThemeCardsListSlice?: RawThemeCardsListSlice;
  videos: string[];
  aboutThisExhibitionContent: AboutThisExhibitionContent[];
}) => {
  // Transform the slice here, similar to thematic browsing approach
  const themeCardsListSlice = rawThemeCardsListSlice
    ? transformThemeCardsList(rawThemeCardsListSlice)
    : undefined;
  // For now, we only want to trial displaying stories here for the Tenderness and Rage exhibition.
  // If this trial is successful, we will want to expand this to other exhibitions in the future.
  const shouldDisplayStories =
    isTendernessAndRageExhibition && aboutThisExhibitionContent.length > 0;
  const shouldDisplayThemes = Boolean(
    themeCardsListSlice && themeCardsListSlice.value.conceptIds.length > 0
  );

  const shouldDisplay =
    shouldDisplayStories || shouldDisplayThemes || videos.length > 0;

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
      </Container>

      {shouldDisplayThemes && themeCardsListSlice && (
        <ThemeCardsList
          conceptIds={themeCardsListSlice.value.conceptIds}
          gtmData={{
            'category-label': themeCardsListSlice.value.title,
            'category-position-in-list': undefined,
          }}
          sliceTitle={themeCardsListSlice.value.title}
          description={themeCardsListSlice.value.description}
          useShim
        />
      )}

      {videos.length > 0 && (
        <Container>
          <p>Videos section</p>
        </Container>
      )}
    </Wrapper>
  );
};

export default ExhibitionCollectionsContent;
