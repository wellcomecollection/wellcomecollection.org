import { NextPage } from 'next';
import styled from 'styled-components';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { useToggles } from '@weco/common/server-data/Context';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout';
import Divider from '@weco/common/views/components/Divider';
import SearchForm from '@weco/common/views/components/SearchForm';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import IsArchiveContext from '@weco/content/contexts/IsArchiveContext';
import {
  toWorkBasic,
  Work as WorkType,
} from '@weco/content/services/wellcome/catalogue/types';
import { TransformedManifest } from '@weco/content/types/manifest';
import { isAllOriginalPdfs } from '@weco/content/utils/iiif/v3';
import { workLd } from '@weco/content/utils/json-ld';
import { removeIdiomaticTextTags } from '@weco/content/utils/string';
import {
  createApiToolbarWorkLinks,
  getDigitalLocationInfo,
  getDigitalLocationOfType,
  showItemLink,
} from '@weco/content/utils/works';

import ArchiveTree from './ArchiveTree';
import RelatedWorks, { hasAtLeastOneSubject } from './RelatedWorks';
import ArchiveBreadcrumb from './work.ArchiveBreadcrumb';
import BackToResults from './work.BackToResults';
import WorkHeader from './work.Header';
import WorkDetails from './WorkDetails';

const ArchiveDetailsContainer = styled.div`
  display: block;
  ${props => props.theme.media('medium')`
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
  transformedManifest?: TransformedManifest;
};

export const WorkPage: NextPage<Props> = ({
  work,
  apiUrl,
  transformedManifest,
}) => {
  const { relatedContentOnWorks } = useToggles();
  const { userIsStaffWithRestricted } = useUserContext();
  const isArchive = !!(
    work.parts.length ||
    (work.partOf.length > 0 && work.partOf[0].totalParts)
  );

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
  const { collectionManifestsCount, canvases, bornDigitalStatus } = {
    ...transformedManifest,
  };

  const allOriginalPdfs = isAllOriginalPdfs(canvases || []);

  const shouldShowItemLink = showItemLink({
    userIsStaffWithRestricted,
    allOriginalPdfs,
    hasIIIFManifest: !!transformedManifest,
    digitalLocation,
    accessCondition: digitalLocationInfo?.accessCondition,
    canvases,
    bornDigitalStatus,
  });

  const imageUrl =
    iiifImageLocation && iiifImageLocation.url
      ? iiifImageTemplate(iiifImageLocation.url)({ size: `800,` })
      : undefined;

  const title = removeIdiomaticTextTags(work.title);

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
        hideNewsletterPromo={true}
      >
        <Container>
          <Space $v={{ size: 'l', properties: ['padding-top'] }}>
            <SearchForm searchCategory="works" location="page" />
          </Space>

          <Space
            $v={{ size: 's', properties: ['padding-top', 'padding-bottom'] }}
          >
            <BackToResults />
          </Space>
        </Container>

        {isArchive ? (
          <>
            <Container>
              <Space
                $v={{
                  size: 's',
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
                  shouldShowItemLink ? collectionManifestsCount : undefined
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

        {/* If the work has no subjects, it's not worth adding this component */}
        {relatedContentOnWorks && hasAtLeastOneSubject(work.subjects) && (
          <RelatedWorks
            workId={work.id}
            subjects={work.subjects}
            typesTechniques={work.genres}
            date={work.production[0]?.dates[0]?.label}
          />
        )}
      </CataloguePageLayout>
    </IsArchiveContext.Provider>
  );
};

export default WorkPage;
