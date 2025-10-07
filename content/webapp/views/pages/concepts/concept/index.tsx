import { NextPage } from 'next';
import { useMemo } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { pageDescriptionConcepts } from '@weco/common/data/microcopy';
import { useToggles } from '@weco/common/server-data/Context';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import DecorativeEdge from '@weco/common/views/components/DecorativeEdge';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';
import { useConceptPageContext } from '@weco/content/contexts/ConceptPageContext';
import { Concept as ConceptType } from '@weco/content/services/wellcome/catalogue/types';
import { Link } from '@weco/content/types/link';
import ImageModal, {
  useExpandedImage,
} from '@weco/content/views/components/ImageModal';
import InPageNavigation from '@weco/content/views/components/InPageNavigation';
import CataloguePageLayout from '@weco/content/views/layouts/CataloguePageLayout';

import Collaborators from './concept.Collaborators';
import Header from './concept.Header';
import { ThemePageSectionsData, themeTabOrder } from './concept.helpers';
import ImagesResults from './concept.ImagesResults';
import RelatedConceptsGroup from './concept.RelatedConceptsGroup';
import {
  HotJarPlaceholder,
  MobileNavBackground,
  NavGridCell,
  StretchWrapper,
} from './concept.styles';
import WorksResults from './concept.WorksResults';

export type Props = {
  conceptResponse: ConceptType;
  sectionsData: ThemePageSectionsData;
  apiToolbarLinks: ApiToolbarLink[];
};

const ConceptPage: NextPage<Props> = ({
  conceptResponse,
  sectionsData,
  apiToolbarLinks,
}) => {
  const allImages = useMemo(
    () =>
      themeTabOrder
        .map(tab => sectionsData[tab].images?.pageResults || [])
        .flat(),
    [sectionsData]
  );
  const { themePagesAllFields } = useToggles();
  const { isEnhanced } = useAppContext();
  const [expandedImage, setExpandedImage] = useExpandedImage(allImages);
  const { config } = useConceptPageContext();

  const { frequentCollaborators, relatedTopics } =
    conceptResponse.relatedConcepts || {};

  const hasWorks = !!(
    sectionsData.by.works?.totalResults ||
    sectionsData.in.works?.totalResults ||
    sectionsData.about.works?.totalResults
  );
  const hasImages = !!(
    sectionsData.by.images?.totalResults ||
    sectionsData.in.images?.totalResults ||
    sectionsData.about.images?.totalResults
  );

  const shouldDisplayImages =
    hasImages &&
    (config.imagesAbout.display ||
      config.imagesBy.display ||
      config.imagesIn.display);
  const shouldDisplayWorks =
    hasWorks &&
    (config.worksBy.display ||
      config.worksIn.display ||
      config.worksAbout.display);
  const shouldDisplayCollaborators =
    frequentCollaborators?.length && config.collaborators.display;
  const shouldDisplayRelatedTopics =
    relatedTopics?.length && config.relatedTopics.display;

  const relatedConceptsGroupLabel =
    config.relatedTopics.label || 'Related topics';

  const buildNavLinks = () => {
    const links: Link[] = [];

    if (shouldDisplayImages)
      links.push({
        text: `Images from the collections`,
        url: `#images`,
      });

    if (shouldDisplayWorks)
      links.push({ text: 'Works from the collections', url: '#works' });

    if (shouldDisplayCollaborators)
      links.push({
        text: 'Frequent collaborators',
        url: '#frequent-collaborators',
      });

    if (shouldDisplayRelatedTopics)
      links.push({
        text: relatedConceptsGroupLabel,
        url: `#related-topics`, // The hashes should remain consistent for tracking
      });

    return links;
  };

  const navLinks = buildNavLinks();

  return (
    <>
      <CataloguePageLayout
        title={conceptResponse.label}
        description={pageDescriptionConcepts(conceptResponse.label)}
        url={{ pathname: `/concepts/${conceptResponse.id}`, query: {} }}
        openGraphType="website"
        siteSection="collections"
        jsonLd={{ '@type': 'WebPage' }}
        hideNewsletterPromo={true}
        apiToolbarLinks={apiToolbarLinks}
        clipOverflowX={true}
      >
        <Header concept={conceptResponse} />

        <>
          <DecorativeEdge
            variant="wobbly"
            backgroundColor={hasImages ? 'neutral.700' : 'white'}
          />
          <MobileNavBackground $isOnWhite={!hasImages} />
        </>

        <Container>
          <Grid style={{ background: 'white', rowGap: 0 }}>
            <NavGridCell
              $isOnWhite={!hasImages}
              $isEnhanced={isEnhanced}
              $sizeMap={{ s: [12], m: [12], l: [3], xl: [2] }}
            >
              <InPageNavigation
                isOnWhite={!hasImages}
                links={navLinks}
                variant="sticky"
              />
            </NavGridCell>

            <GridCell $sizeMap={{ s: [12], m: [12], l: [9], xl: [10] }}>
              {shouldDisplayImages && (
                <StretchWrapper>
                  <ImagesResults
                    sectionsData={sectionsData}
                    concept={conceptResponse}
                  />
                </StretchWrapper>
              )}

              {shouldDisplayWorks && (
                <WorksResults
                  concept={conceptResponse}
                  sectionsData={sectionsData}
                />
              )}

              {(shouldDisplayCollaborators || themePagesAllFields) && (
                <>
                  <Space
                    $v={{
                      size: 'xl',
                      properties: ['margin-top', 'margin-bottom'],
                    }}
                  >
                    <Collaborators concepts={frequentCollaborators} />
                  </Space>
                </>
              )}
              {(shouldDisplayRelatedTopics || themePagesAllFields) && (
                <Space
                  $v={{
                    size: 'xl',
                    properties: ['margin-top', 'margin-bottom'],
                  }}
                >
                  <RelatedConceptsGroup
                    dataGtmTriggerName="related_topics"
                    label={relatedConceptsGroupLabel}
                    labelType="heading"
                    relatedConcepts={relatedTopics}
                    buttonColors={
                      themeValues.buttonColors.silverTransparentBlack
                    }
                  />
                </Space>
              )}
              {
                // This is a placeholder for the Hotjar embedded survey to be injected
                // when the concept is a Person. It should be removed when the survey
                // is no longer used.
              }
              {conceptResponse.type === 'Person' && (
                <HotJarPlaceholder id="hotjar-embed-placeholder-concept-person" />
              )}
            </GridCell>
          </Grid>
        </Container>
      </CataloguePageLayout>

      {/* https://frontendmasters.com/blog/containers-context/
      A Safari bug is forcing this to live here instead of its parent, ImageResults.
      The bug got fixed in Safari 18.2 (I think) but we support the latest two versions.
      It would be nice to move it back inside ImageResults once we're two versions ahead. */}
      <ImageModal
        images={allImages}
        expandedImage={expandedImage}
        setExpandedImage={setExpandedImage}
      />
    </>
  );
};

export default ConceptPage;
