import { NextPage } from 'next';
import styled from 'styled-components';

import { useKiosk } from '@weco/common/contexts/KioskContext';
import { useUserContext } from '@weco/common/contexts/UserContext';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { useFeatureFlags } from '@weco/common/server-data/Context';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import Divider from '@weco/common/views/components/Divider';
import SearchForm from '@weco/common/views/components/SearchForm';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import IsArchiveContext from '@weco/content/contexts/IsArchiveContext';
import useManifest from '@weco/content/hooks/useManifest';
import {
  toWorkBasic,
  Work as WorkType,
} from '@weco/content/services/wellcome/catalogue/types';
import { workLd } from '@weco/content/utils/json-ld';
import { removeDisplayMarkupTags } from '@weco/content/utils/string';
import {
  createApiToolbarWorkLinks,
  getArchiveAncestorArray,
  getDigitalLocationInfo,
  getDigitalLocationOfType,
  showItemLink,
} from '@weco/content/utils/works';
import CataloguePageLayout from '@weco/content/views/layouts/CataloguePageLayout';

import ArchiveCollectionLayout from './ArchiveCollection';
import ArchiveTree from './ArchiveTree';
import RelatedWorks, { hasAtLeastOneSubject } from './RelatedWorks';
import ArchiveBreadcrumb from './work.ArchiveBreadcrumb';
import BackToResults from './work.BackToResults';
import WorkHeader from './work.Header';
import StoriesOnWorks from './work.StoriesOnWorks';
import WorkDetails from './WorkDetails';

const ArchiveDetailsContainer = styled.div`
  display: block;
  ${props => props.theme.media('sm')`
    display: flex;
  `}
`;

const WorkDetailsWrapper = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top'] },
})`
  flex: 1;
  min-width: 0; /* prevent item overflowing its container */
`;

export type Props = {
  work: WorkType;
  apiUrl: string;
};

export const WorkPage: NextPage<Props> = ({ work, apiUrl }) => {
  const { isKiosk } = useKiosk();
  const { archiveCollection } = useFeatureFlags();
  const { userIsStaffWithRestricted } = useUserContext();
  const isArchive = !!(
    work.parts.length || getArchiveAncestorArray(work).length > 0
  );
  const displayCollectionRoot = !!work.collection?.isRoot && archiveCollection;

  const iiifImageLocation = getDigitalLocationOfType(work, 'iiif-image');
  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );

  // Determine digital location. If the work has a iiif-presentation location and a iiif-image location
  // we use the former
  const digitalLocation: DigitalLocation | undefined =
    iiifPresentationLocation || iiifImageLocation;
  const digitalLocationInfo =
    digitalLocation && getDigitalLocationInfo(digitalLocation);

  // The manifest is only needed for the item count and to hide the item
  // link if it's restricted, so we fetch it client side rather than
  // blocking SSR on it. The link renders optimistically until this resolves.
  const { transformedManifest, isLoading: isManifestLoading } = useManifest(
    digitalLocation,
    work.workType?.id
  );
  const { collectionManifestsCount } = {
    ...transformedManifest,
  };
  // accessRequirements can contain more than one label when a manifest is
  // only partially restricted (e.g. ['Restricted files', 'Open']) - the item
  // link should stay visible in that case, since some content is still
  // viewable. Only hide it when every canvas requires restricted access.
  //
  // This is a manifest-level check, separate from and additive to
  // accessCondition (the catalogue API's rights classification). It exists
  // as a safety net for the catalogue and the IIIF manifest getting out of
  // sync - e.g. accessCondition says 'open' but the manifest itself is
  // fully restricted - so we don't link to a work that can't actually be
  // viewed.
  const accessRequirements = transformedManifest?.auth.accessRequirements;
  const isRestrictedByManifest = isManifestLoading
    ? undefined
    : accessRequirements?.length === 1 &&
      accessRequirements[0] === 'Restricted files';

  const shouldShowItemLink = showItemLink({
    userIsStaffWithRestricted,
    hasIIIFManifest: !!digitalLocation,
    digitalLocation,
    accessCondition: digitalLocationInfo?.accessCondition,
    isRestrictedByManifest,
  });

  const imageUrl =
    iiifImageLocation && iiifImageLocation.url
      ? iiifImageTemplate(iiifImageLocation.url)({ size: `800,` })
      : undefined;

  const title = removeDisplayMarkupTags(work.title);

  const image = imageUrl
    ? {
        contentUrl: imageUrl,
        alt: title,
        width: 0,
        height: 0,
        crops: {},
      }
    : undefined;

  return (
    <IsArchiveContext.Provider value={isArchive}>
      <CataloguePageLayout
        title={title}
        description={work.description || title}
        url={{ pathname: `/works/${work.id}` }}
        openGraphType="website"
        jsonLd={workLd(work)}
        siteSection="collections"
        image={image}
        apiToolbarLinks={createApiToolbarWorkLinks(work, apiUrl)}
        hideNewsletterPromo
      >
        {!isKiosk && (
          <Container>
            <Space $v={{ size: 'md', properties: ['padding-top'] }}>
              <SearchForm searchCategory="works" location="page" />
            </Space>

            <Space
              $v={{ size: 'xs', properties: ['padding-top', 'padding-bottom'] }}
            >
              <BackToResults />
            </Space>
          </Container>
        )}

        <ConditionalWrapper
          condition={isKiosk}
          wrapper={children => (
            <Space $v={{ size: 'md', properties: ['padding-top'] }}>
              {children}
            </Space>
          )}
        >
          <>
            {isArchive ? (
              displayCollectionRoot ? (
                <ArchiveCollectionLayout key={work.id} work={work} />
              ) : (
                <>
                  <Container>
                    <Space
                      $v={{
                        size: 'xs',
                        properties: ['padding-top', 'padding-bottom'],
                      }}
                    >
                      <ArchiveBreadcrumb work={work} />
                    </Space>
                  </Container>
                  <Container>
                    <WorkHeader
                      work={toWorkBasic(work)}
                      collectionManifestsCount={
                        shouldShowItemLink
                          ? collectionManifestsCount
                          : undefined
                      }
                    />
                  </Container>

                  <Container>
                    <Divider />
                    <ArchiveDetailsContainer>
                      <ArchiveTree work={work} />
                      <WorkDetailsWrapper>
                        <WorkDetails
                          work={work}
                          shouldShowItemLink={shouldShowItemLink}
                          iiifImageLocation={iiifImageLocation}
                          digitalLocation={digitalLocation}
                          digitalLocationInfo={digitalLocationInfo}
                          transformedManifest={transformedManifest}
                        />
                      </WorkDetailsWrapper>
                    </ArchiveDetailsContainer>
                  </Container>
                </>
              )
            ) : (
              <>
                <Container>
                  <WorkHeader
                    work={toWorkBasic(work)}
                    collectionManifestsCount={
                      shouldShowItemLink ? collectionManifestsCount : undefined
                    }
                  />
                </Container>
                <WorkDetails
                  work={work}
                  shouldShowItemLink={shouldShowItemLink}
                  iiifImageLocation={iiifImageLocation}
                  digitalLocation={digitalLocation}
                  digitalLocationInfo={digitalLocationInfo}
                  transformedManifest={transformedManifest}
                />
              </>
            )}
          </>
        </ConditionalWrapper>

        {!displayCollectionRoot && (
          <>
            <StoriesOnWorks
              workId={work.id}
              showDivider={hasAtLeastOneSubject(work.subjects)}
            />

            {/* If the work has no subjects, it's not worth adding this component */}
            {hasAtLeastOneSubject(work.subjects) && (
              <RelatedWorks
                workId={work.id}
                subjects={work.subjects}
                typesTechniques={work.genres}
                date={work.production[0]?.dates[0]?.label}
              />
            )}
          </>
        )}
      </CataloguePageLayout>
    </IsArchiveContext.Provider>
  );
};

export default WorkPage;
