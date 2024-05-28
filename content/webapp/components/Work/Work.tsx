import { FunctionComponent } from 'react';
import styled from 'styled-components';
import {
  Work as WorkType,
  toWorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import {
  Location as LocationType,
  DigitalLocation,
} from '@weco/common/model/catalogue';
import { grid } from '@weco/common/utils/classnames';
import {
  getDigitalLocationOfType,
  getDigitalLocationInfo,
} from '@weco/content/utils/works';
import { hasItemType } from '@weco/content/utils/iiif/v3';
import { removeIdiomaticTextTags } from '@weco/content/utils/string';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import CataloguePageLayout from '../CataloguePageLayout/CataloguePageLayout';
import { workLd } from '@weco/content/utils/json-ld';
import BackToResults from '@weco/content/components/BackToResults/BackToResults';
import WorkHeader from '../WorkHeader/WorkHeader';
import ArchiveBreadcrumb from '../ArchiveBreadcrumb/ArchiveBreadcrumb';
import Space from '@weco/common/views/components/styled/Space';
import WorkDetails from '../WorkDetails';
import ArchiveTree from '../ArchiveTree';
import SearchForm from '@weco/common/views/components/SearchForm/SearchForm';
import Divider from '@weco/common/views/components/Divider/Divider';
import IsArchiveContext from '../IsArchiveContext/IsArchiveContext';
import useTransformedManifest from '@weco/content/hooks/useTransformedManifest';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import {
  TransformedCanvas,
  BornDigitalStatus,
} from '@weco/content/types/manifest';

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

export const Grid = styled.div.attrs({
  className: 'grid',
})``;

function showItemLink({
  digitalLocation,
  accessCondition,
  canvases,
  bornDigitalStatus,
}: {
  digitalLocation: DigitalLocation | undefined;
  accessCondition: string | undefined;
  canvases: TransformedCanvas[] | undefined;
  bornDigitalStatus: BornDigitalStatus | undefined;
}): boolean {
  // In general we don't show the item link if there are born digital items present, i.e. canvases with a behavior of placeholder, because we display download links on the page instead.
  // The exception to this is if ALL the items are born digital and they are ALL pdfs, as we know we can show them on the items page.
  // We also don't show the item link if there are video or sound items present because we display the players on the page instead.
  // This means we rely on there only being one type of thing in a manifest, otherwise non video/sound items will be hidden from the user.
  // This is usually the case, except for manifests with 'Born digital' items.
  // But since we display links to all files when there are 'Born digital' items present, then this should not matter.
  const hasVideo = hasItemType(canvases, 'Video');
  const hasSound =
    hasItemType(canvases, 'Sound') || hasItemType(canvases, 'Audio');
  const allOriginalPdfs = !!canvases?.every(canvas =>
    canvas.original.find(original => original.format === 'application/pdf')
  );
  if (accessCondition === 'closed' || accessCondition === 'restricted') {
    return false;
  } else if (
    digitalLocation &&
    !hasVideo &&
    !hasSound &&
    (bornDigitalStatus === 'noBornDigital' || allOriginalPdfs)
    // we should always show link if
    // allBornDigital and allPdf
    // how do we determine if allPdf
    // what happens with non bornDigital PDFs
  ) {
    return true;
  } else {
    return false;
  }
}

function createApiToolbarLinks(
  work: WorkType,
  apiUrl: string
): ApiToolbarLink[] {
  const apiLink = {
    id: 'json',
    label: 'JSON',
    link: apiUrl,
  };

  const iiifItem = work.items
    ?.reduce((acc, item) => {
      return acc.concat(item.locations);
    }, [] as LocationType[])
    ?.find(location => location.locationType.id.startsWith('iiif'));

  const iiifLink = iiifItem &&
    iiifItem.type === 'DigitalLocation' && {
      id: 'iiif',
      label: 'IIIF',
      link: iiifItem.url.replace('/v2/', '/v3/'),
    };

  const links = [
    apiLink,
    iiifLink,
    ...work.identifiers.map(id => ({
      id: id.value,
      label: id.identifierType.label,
      value: id.value,
    })),
  ].filter(Boolean) as ApiToolbarLink[];

  return links;
}

type Props = {
  work: WorkType;
  apiUrl: string;
};

const Work: FunctionComponent<Props> = ({ work, apiUrl }) => {
  const transformedIIIFManifest = useTransformedManifest(work);

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
    ...transformedIIIFManifest,
  };

  const shouldShowItemLink = showItemLink({
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
        apiToolbarLinks={createApiToolbarLinks(work, apiUrl)}
        hideNewsletterPromo={true}
      >
        <Container>
          <Grid>
            <Space
              className={grid({ s: 12 })}
              $v={{ size: 'l', properties: ['padding-top'] }}
            >
              <SearchForm searchCategory="works" location="page" />
            </Space>
          </Grid>
          <Grid>
            <Space
              className={grid({ s: 12 })}
              $v={{ size: 's', properties: ['padding-top', 'padding-bottom'] }}
            >
              <BackToResults />
            </Space>
          </Grid>
        </Container>

        {isArchive ? (
          <>
            <Container>
              <Grid>
                <Space
                  className={grid({ s: 12 })}
                  $v={{
                    size: 's',
                    properties: ['padding-top', 'padding-bottom'],
                  }}
                >
                  <ArchiveBreadcrumb work={work} />
                </Space>
              </Grid>
            </Container>
            <Container>
              <Grid>
                <WorkHeader
                  work={toWorkBasic(work)}
                  collectionManifestsCount={collectionManifestsCount}
                />
              </Grid>
            </Container>

            <Container>
              <Divider />
              <ArchiveDetailsContainer>
                <ArchiveTree work={work} />
                <WorkDetailsWrapper>
                  <WorkDetails
                    work={work}
                    shouldShowItemLink={shouldShowItemLink}
                  />
                </WorkDetailsWrapper>
              </ArchiveDetailsContainer>
            </Container>
          </>
        ) : (
          <>
            <Container>
              <Grid>
                <WorkHeader
                  work={toWorkBasic(work)}
                  collectionManifestsCount={collectionManifestsCount}
                />
              </Grid>
            </Container>
            <WorkDetails work={work} shouldShowItemLink={shouldShowItemLink} />
          </>
        )}
      </CataloguePageLayout>
    </IsArchiveContext.Provider>
  );
};

export default Work;
