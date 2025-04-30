import { GetServerSideProps, NextPage } from 'next';
import styled from 'styled-components';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { Pageview } from '@weco/common/services/conversion/track';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { serialiseProps } from '@weco/common/utils/json';
import Divider from '@weco/common/views/components/Divider';
import SearchForm from '@weco/common/views/components/SearchForm';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import ArchiveBreadcrumb from '@weco/content/components/ArchiveBreadcrumb';
import ArchiveTree from '@weco/content/components/ArchiveTree';
import BackToResults from '@weco/content/components/BackToResults';
import CataloguePageLayout from '@weco/content/components/CataloguePageLayout';
import WorkDetails from '@weco/content/components/WorkDetails';
import WorkHeader from '@weco/content/components/WorkHeader';
import IsArchiveContext from '@weco/content/contexts/IsArchiveContext';
import useHotjar from '@weco/content/hooks/useHotjar';
import { fetchIIIFPresentationManifest } from '@weco/content/services/iiif/fetch/manifest';
import { transformManifest } from '@weco/content/services/iiif/transformers/manifest';
import { looksLikeCanonicalId } from '@weco/content/services/wellcome/catalogue';
import {
  toWorkBasic,
  Work as WorkType,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWork } from '@weco/content/services/wellcome/catalogue/works';
import { TransformedManifest } from '@weco/content/types/manifest';
import { isAllOriginalPdfs } from '@weco/content/utils/iiif/v3';
import { workLd } from '@weco/content/utils/json-ld';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { removeIdiomaticTextTags } from '@weco/content/utils/string';
import {
  createApiToolbarWorkLinks,
  getDigitalLocationInfo,
  getDigitalLocationOfType,
  showItemLink,
} from '@weco/content/utils/works';

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

type Props = {
  work: WorkType;
  apiUrl: string;
  transformedManifest?: TransformedManifest;
  pageview: Pageview;
};

export const WorkPage: NextPage<Props> = ({
  work,
  apiUrl,
  transformedManifest,
}) => {
  useHotjar(true);
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
      </CataloguePageLayout>
    </IsArchiveContext.Provider>
  );
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);
  const { workId } = context.query;

  if (!looksLikeCanonicalId(workId)) {
    return { notFound: true };
  }

  const workResponse = await getWork({
    id: workId,
    toggles: serverData.toggles,
  });

  if (workResponse.type === 'Redirect') {
    return {
      redirect: {
        destination: `/works/${workResponse.redirectToId}`,
        permanent: workResponse.status === 301,
      },
    };
  }

  if (workResponse.type === 'Error') {
    if (workResponse.httpStatus === 404) {
      return { notFound: true };
    }
    return appError(context, workResponse.httpStatus, workResponse.description);
  }

  const { url, ...work } = workResponse;

  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );

  const iiifManifest =
    iiifPresentationLocation &&
    (await fetchIIIFPresentationManifest({
      location: iiifPresentationLocation.url,
      workTypeId: work.workType?.id,
    }));

  const transformedManifest = iiifManifest && transformManifest(iiifManifest);

  return {
    props: serialiseProps({
      work,
      transformedManifest,
      apiUrl: url,
      serverData,
      pageview: {
        name: 'work',
        // we shouldn't overload this
        // these metrics allow us to report back on breadth of collection accessed
        properties: {
          workType: workResponse.workType?.id,
          identifiers: workResponse.identifiers.map(id => id.value),
          identifierTypes: workResponse.identifiers.map(
            id => id.identifierType.id
          ),
        },
      },
    }),
  };
};

export default WorkPage;
