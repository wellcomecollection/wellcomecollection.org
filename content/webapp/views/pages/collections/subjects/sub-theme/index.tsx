import { SliceZone } from '@prismicio/react';
import { NextPage } from 'next';
import { ReactElement } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { ThemeCardsListSlice as RawThemeCardsListSlice } from '@weco/common/prismicio-types';
import { ReturnedResults } from '@weco/common/utils/search';
import {
  ApiToolbarLink,
  createPrismicLink,
} from '@weco/common/views/components/ApiToolbar';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import { Container } from '@weco/common/views/components/styled/Container';
import { GridCell, SizeMap } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { components } from '@weco/common/views/slices';
import {
  Image as ImageType,
  RelatedConcept,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { Link } from '@weco/content/types/link';
import { Page } from '@weco/content/types/pages';
import ImageModal, {
  useExpandedImage,
} from '@weco/content/views/components/ImageModal';
import InPageNavigation from '@weco/content/views/components/InPageNavigation';
import WorkCards from '@weco/content/views/components/WorkCards';
import ThematicBrowsingLayout from '@weco/content/views/layouts/ThematicBrowsingLayout';

import SubThemeImages from './sub-theme.Images';
import SubThemeRelatedTopics from './sub-theme.RelatedTopics';
import SectionContainer from './sub-theme.SectionContainer';
import SubThemeStories from './sub-theme.Stories';
import {
  DarkSectionWrapper,
  PageGrid,
  StretchWrapper,
  ThemeCardsListSection,
  Title,
} from './sub-theme.styles';
import SubThemeWorks from './sub-theme.Works';

type TransformedWorkTypeBucket = {
  id: string;
  label: string;
  count: number;
};
export type WorksForTabs = ReturnedResults<WorkBasic> & {
  workTypes: TransformedWorkTypeBucket[];
};

type WorksAndImagesResponse = {
  works?: WorksForTabs;
  images?: ReturnedResults<ImageType>;
  displayLabels: string[];
};

export type Props = {
  thematicBrowsingPage: Page;
  apiToolbarLinks: ApiToolbarLink[];
  curatedUid: string;
  categoryThemeCardsList?: RawThemeCardsListSlice;
  newOnlineWorks: WorkBasic[];
  relatedStoriesId: string[];
  worksAndImagesAbout: WorksAndImagesResponse;
  relatedTopics: RelatedConcept[];
  jsonLd: JsonLdObj;
};

const WellcomeSubThemePage: NextPage<Props> & {
  getLayout?: (page: ReactElement<Props>) => ReactElement;
} = ({
  thematicBrowsingPage,
  categoryThemeCardsList,
  newOnlineWorks,
  relatedStoriesId,
  worksAndImagesAbout,
  relatedTopics,
}) => {
  const [expandedImage, setExpandedImage] = useExpandedImage(
    worksAndImagesAbout.images?.pageResults || []
  );

  const hasNewOnlineWorks = newOnlineWorks.length > 0;
  const hasRelatedStories = relatedStoriesId.length > 0;
  const hasWorksAbout =
    !!worksAndImagesAbout.works && worksAndImagesAbout.works.totalResults > 0;
  const hasImagesAbout = !!(
    worksAndImagesAbout.images && worksAndImagesAbout.images.totalResults > 0
  );
  const hasRelatedTopics = relatedTopics.length > 0;

  const lowerCasePageTitle = thematicBrowsingPage.title.toLowerCase();
  const onThisPage = [
    hasNewOnlineWorks && {
      text: `New works in ${lowerCasePageTitle}`,
      url: `#new-online`,
    },
    hasRelatedStories && {
      text: `Stories about ${lowerCasePageTitle}`,
      url: `#stories`,
    },
    hasImagesAbout && {
      text: `Images from the collections`,
      url: `#images-about`,
    },
    hasWorksAbout && {
      text: `Works from the collections`,
      url: `#works-about`,
    },
    hasRelatedTopics && { text: `Related topics`, url: `#related-topics` },
  ].filter((item): item is Link => Boolean(item));

  const hasNavigation = onThisPage.length > 0;
  const contentSizeMap = (
    hasNavigation
      ? { s: [12], m: [12], l: [9], xl: [9] }
      : { s: [12], m: [12], l: [12], xl: [12] }
  ) satisfies SizeMap;

  return (
    <Container>
      {categoryThemeCardsList && (
        <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
          <ThemeCardsListSection>
            <SliceZone
              slices={[categoryThemeCardsList]}
              components={components}
              context={{ hasNoShim: true }}
            />
          </ThemeCardsListSection>
        </Space>
      )}

      <PageGrid>
        {hasNavigation && (
          <InPageNavigation
            links={onThisPage}
            sizeMap={{ s: [12], m: [12], l: [3], xl: [3] }}
            isOnWhite
          />
        )}

        <GridCell $sizeMap={contentSizeMap}>
          <Space $v={{ size: 'md', properties: ['padding-top'] }}>
            {hasNewOnlineWorks && (
              <SectionContainer
                title={`New works in ${lowerCasePageTitle}`}
                id="new-online"
                isFirst
              >
                <WorkCards works={newOnlineWorks} columns={3} />
              </SectionContainer>
            )}

            {hasRelatedStories && (
              <SectionContainer
                title={`Stories about ${lowerCasePageTitle}`}
                id="stories"
                isFirst={!hasNewOnlineWorks}
              >
                <SubThemeStories relatedStoriesId={relatedStoriesId} />
              </SectionContainer>
            )}

            {hasImagesAbout && (
              <StretchWrapper $hasDarkBackground>
                <DarkSectionWrapper>
                  <Title id="images-about">
                    Images about {lowerCasePageTitle}
                  </Title>

                  <SubThemeImages
                    subThemeName={lowerCasePageTitle}
                    images={worksAndImagesAbout.images!}
                    conceptsDisplayLabels={worksAndImagesAbout.displayLabels}
                  />
                </DarkSectionWrapper>
              </StretchWrapper>
            )}

            {hasWorksAbout && (
              <SectionContainer
                title={`Works about ${lowerCasePageTitle}`}
                id="works-about"
                isFirst={
                  !hasNewOnlineWorks && !hasRelatedStories && !hasImagesAbout
                }
              >
                <SubThemeWorks
                  subThemeName={lowerCasePageTitle}
                  works={worksAndImagesAbout.works!}
                  conceptsDisplayLabels={worksAndImagesAbout.displayLabels}
                />
              </SectionContainer>
            )}

            {hasRelatedTopics && (
              <SectionContainer
                title="Related topics"
                id="related-topics"
                isFirst={
                  !hasNewOnlineWorks &&
                  !hasRelatedStories &&
                  !hasImagesAbout &&
                  !hasWorksAbout
                }
              >
                <SubThemeRelatedTopics relatedTopics={relatedTopics} />
              </SectionContainer>
            )}
          </Space>
        </GridCell>
      </PageGrid>

      {hasImagesAbout && (
        <>
          {/* https://frontendmasters.com/blog/containers-context/
            A Safari bug is forcing this to live here instead of its parent, ImageResults.
            The bug got fixed in Safari 18.2 (I think) but we support the latest two versions.
            It would be nice to move it back inside ImageResults once we're two versions ahead. */}
          <ImageModal
            images={worksAndImagesAbout.images!.pageResults}
            expandedImage={expandedImage}
            setExpandedImage={setExpandedImage}
          />
        </>
      )}
    </Container>
  );
};

WellcomeSubThemePage.getLayout = page => {
  return (
    <ThematicBrowsingLayout
      page={page.props.thematicBrowsingPage}
      apiToolbarLinks={[
        ...page.props.apiToolbarLinks,
        createPrismicLink(page.props.thematicBrowsingPage.id),
      ]}
      currentCategory="subjects"
      subPageUid={page.props.curatedUid}
      extraBreadcrumbs={[
        { url: `/${prismicPageIds.collections}/subjects`, text: 'Subjects' },
      ]}
      jsonLd={page.props.jsonLd}
    >
      {page}
    </ThematicBrowsingLayout>
  );
};

export default WellcomeSubThemePage;
