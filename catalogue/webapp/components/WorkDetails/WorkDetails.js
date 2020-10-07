// @flow
import moment from 'moment';
import { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import { type IIIFManifest } from '@weco/common/model/iiif';
import { type Work } from '@weco/common/model/work';
import type { NextLinkType } from '@weco/common/model/next-link-type';
import { font, classNames } from '@weco/common/utils/classnames';
import { downloadUrl } from '@weco/common/services/catalogue/urls';
import { worksLink } from '@weco/common/services/catalogue/routes';
import {
  getDownloadOptionsFromImageUrl,
  getDigitalLocationOfType,
  getAccessConditionForDigitalLocation,
  getWorkIdentifiersWith,
  getEncoreLink,
  sierraIdFromPresentationManifestUrl,
} from '@weco/common/utils/works';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';
import {
  getAudio,
  getVideo,
  getDownloadOptionsFromManifest,
  getIIIFPresentationCredit,
  getUiExtensions,
  isUiEnabled,
} from '@weco/common/utils/iiif';
import NextLink from 'next/link';
// $FlowFixMe (tsx)
import CopyUrl from '@weco/common/views/components/CopyUrl/CopyUrl';
import Space from '@weco/common/views/components/styled/Space';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import Download from '../Download/Download';
import WorkDetailsSection from '../WorkDetailsSection/WorkDetailsSection';
import WorkDetailsText from '../WorkDetailsText/WorkDetailsText';
import WorkDetailsList from '../WorkDetailsList/WorkDetailsList';
import WorkDetailsLinks from '../WorkDetailsLinks/WorkDetailsLinks';
import WorkDetailsTags from '../WorkDetailsTags/WorkDetailsTags';
import VideoPlayer from '@weco/common/views/components/VideoPlayer/VideoPlayer';
import AudioPlayer from '@weco/common/views/components/AudioPlayer/AudioPlayer';
// $FlowFixMe (tsx)
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
// $FlowFixMe (tsx)
import ButtonOutlinedLink from '@weco/common/views/components/ButtonOutlinedLink/ButtonOutlinedLink';
import ExplanatoryText from '@weco/common/views/components/ExplanatoryText/ExplanatoryText';
import type { DigitalLocation } from '@weco/common/utils/works';
import { trackEvent } from '@weco/common/utils/ga';
import ItemLocation from '../RequestLocation/RequestLocation';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
type Props = {|
  work: Work,
  iiifPresentationManifest: ?IIIFManifest,
  childManifestsCount: number,
  imageCount: number,
  itemUrl: ?NextLinkType,
|};

// At the moment we aren't set up to cope with access conditions 'open-with-advisory, 'restricted',
// 'permission-required', so we pass them off to the UV on the library site
// If we have audio or video, then we show it in situ and don't link to the Item page
function getItemLinkState({
  accessCondition,
  sierraIdFromManifestUrl,
  itemUrl,
  audio,
  video,
}): ?'useItemLink' | 'useLibraryLink' {
  if (
    (accessCondition === 'open-with-advisory' ||
      accessCondition === 'restricted' ||
      accessCondition === 'permission-required') &&
    sierraIdFromManifestUrl
  )
    return 'useLibraryLink';
  if (itemUrl && !audio && !video) {
    return 'useItemLink';
  }
}

const WorkDetails = ({
  work,
  iiifPresentationManifest,
  childManifestsCount,
  imageCount,
  itemUrl,
}: Props) => {
  const [imageJson, setImageJson] = useState(null);
  const fetchImageJson = async () => {
    try {
      const imageJson =
        iiifImageLocation &&
        (await fetch(iiifImageLocation.url).then(resp => resp.json()));
      setImageJson(imageJson);
    } catch (e) {}
  };
  useEffect(() => {
    fetchImageJson();
  }, []);

  // Determine digital location
  const iiifImageLocation = getDigitalLocationOfType(work, 'iiif-image');
  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );
  const digitalLocation: ?DigitalLocation =
    iiifPresentationLocation || iiifImageLocation;

  // Determine access conditions of digital location
  const accessCondition = getAccessConditionForDigitalLocation(digitalLocation);

  // 'Available online' data
  const video = iiifPresentationManifest && getVideo(iiifPresentationManifest);
  const audio = iiifPresentationManifest && getAudio(iiifPresentationManifest);
  const license =
    digitalLocation &&
    digitalLocation.license &&
    getAugmentedLicenseInfo(digitalLocation.license);

  // iiif-presentation locations don't have credit info in the work API currently, so we try and get it from the manifest
  const credit =
    (digitalLocation && digitalLocation.credit) ||
    (iiifPresentationManifest &&
      getIIIFPresentationCredit(iiifPresentationManifest));

  const iiifImageLocationUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImageDownloadOptions = iiifImageLocationUrl
    ? getDownloadOptionsFromImageUrl({
        url: iiifImageLocationUrl,
        width: imageJson && imageJson.width,
        height: imageJson && imageJson.height,
      })
    : [];
  const iiifPresentationDownloadOptions = iiifPresentationManifest
    ? getDownloadOptionsFromManifest(iiifPresentationManifest)
    : [];

  const downloadOptions = [
    ...iiifImageDownloadOptions,
    ...iiifPresentationDownloadOptions,
  ];

  // 'About this work' data
  const duration =
    work.duration && moment.utc(work.duration).format('HH:mm:ss');

  // 'Identifiers' data
  const isbnIdentifiers = work.identifiers.filter(id => {
    return id.identifierType.id === 'isbn';
  });

  const sierraIdFromManifestUrl =
    iiifPresentationLocation &&
    sierraIdFromPresentationManifestUrl(iiifPresentationLocation.url);

  const sierraWorkIds = getWorkIdentifiersWith(work, {
    identifierId: 'sierra-system-number',
  });

  const sierraWorkId = sierraWorkIds.length >= 1 ? sierraWorkIds[0] : null;

  // We do not wish to display a link to the old library site if the new site
  // provides a digital representation of that work
  const encoreLink =
    !digitalLocation && sierraWorkId && getEncoreLink(sierraWorkId);

  const locationOfWork = work.notes.find(
    note => note.noteType.id === 'location-of-original'
  );
  const arrangementNote = work.notes.filter(
    note => note.noteType.id === 'arrangement-note'
  );
  const biographicalNote = work.notes.filter(
    note => note.noteType.id === 'biographical-note'
  );
  const relatedMaterial = work.notes.filter(
    note => note.noteType.id === 'related-material'
  );
  const acquisitionNote = work.notes.filter(
    note => note.noteType.id === 'acquisition-note'
  );

  const orderedNotes = [
    ...arrangementNote,
    ...acquisitionNote,
    ...biographicalNote,
    ...relatedMaterial,
  ];

  const remainingNotes = work.notes.filter(note => {
    return !orderedNotes.some(n => n === note);
  });

  const showDownloadOptions = iiifPresentationManifest
    ? isUiEnabled(getUiExtensions(iiifPresentationManifest), 'mediaDownload')
    : true;

  const itemLinkState = getItemLinkState({
    accessCondition,
    sierraIdFromManifestUrl,
    itemUrl,
    audio,
    video,
  });

  const WhereToFindIt = () => (
    <WorkDetailsSection
      headingText="Where to find it"
      isInArchive={isInArchive}
    >
      {locationOfWork && (
        <WorkDetailsText
          title={locationOfWork.noteType.label}
          text={locationOfWork.contents}
        />
      )}

      <TogglesContext.Consumer>
        {({ stacksRequestService }) =>
          !stacksRequestService &&
          encoreLink && (
            <Space
              v={{
                size: 'l',
                properties: ['margin-bottom'],
              }}
            >
              <WorkDetailsText
                text={[
                  `<a href="${encoreLink}">Access this item on the Wellcome Library website</a>`,
                ]}
              />
            </Space>
          )
        }
      </TogglesContext.Consumer>

      <TogglesContext.Consumer>
        {({ stacksRequestService }) =>
          stacksRequestService && <ItemLocation work={work} />
        }
      </TogglesContext.Consumer>
    </WorkDetailsSection>
  );

  const isInArchive = work.parts.length > 0 || work.partOf.length > 0;

  const Content = () => (
    <>
      {digitalLocation && (
        <WorkDetailsSection
          headingText="Available online"
          isInArchive={isInArchive}
        >
          {video && (
            <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
              <VideoPlayer
                video={video}
                showDownloadOptions={showDownloadOptions}
              />
            </Space>
          )}
          {audio && (
            <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
              <AudioPlayer audio={audio} />
            </Space>
          )}
          {itemLinkState === 'useLibraryLink' && (
            <Space
              as="span"
              h={{
                size: 'm',
                properties: ['margin-right'],
              }}
            >
              <ButtonSolidLink
                icon="eye"
                text="View"
                trackingEvent={{
                  category: 'WorkDetails',
                  action: 'follow view link',
                  label: work.id,
                }}
                link={`https://wellcomelibrary.org/item/${sierraIdFromManifestUrl ||
                  ''}`}
              />
            </Space>
          )}
          {itemLinkState === 'useItemLink' && (
            <>
              {work.thumbnail && (
                <Space
                  v={{
                    size: 's',
                    properties: ['margin-bottom'],
                  }}
                >
                  <ConditionalWrapper
                    condition={itemUrl}
                    wrapper={children => (
                      <NextLink {...itemUrl}>
                        <a
                          onClick={trackEvent({
                            category: 'WorkDetails',
                            action: 'follow image link',
                            label: itemUrl?.href?.query?.workId,
                          })}
                        >
                          {children}
                        </a>
                      </NextLink>
                    )}
                  >
                    <img
                      style={{
                        width: 'auto',
                        height: 'auto',
                      }}
                      alt={`view ${work.title}`}
                      src={work.thumbnail.url}
                    />
                  </ConditionalWrapper>
                </Space>
              )}

              <div
                className={classNames({
                  'flex flex-h-center': true,
                })}
              >
                <Space
                  as="span"
                  h={{
                    size: 'm',
                    properties: ['margin-right'],
                  }}
                >
                  <ButtonSolidLink
                    icon="eye"
                    text="View"
                    trackingEvent={{
                      category: 'WorkDetails',
                      action: 'follow view link',
                      label: itemUrl?.href?.query?.workId,
                    }}
                    link={{ ...itemUrl }}
                  />
                </Space>

                {showDownloadOptions && (
                  <Download
                    ariaControlsId="itemDownloads"
                    workId={work.id}
                    downloadOptions={downloadOptions}
                  />
                )}
              </div>
              {!(downloadOptions.length > 0) &&
                sierraIdFromManifestUrl &&
                childManifestsCount === 0 && (
                  <NextLink
                    {...downloadUrl({
                      workId: work.id,
                      sierraId: sierraIdFromManifestUrl,
                    })}
                  >
                    <a>Download options</a>
                  </NextLink>
                )}
              {(childManifestsCount > 0 || imageCount > 0) && (
                <Space
                  v={{
                    size: 'm',
                    properties: ['margin-top'],
                  }}
                >
                  <p
                    className={classNames({
                      'no-margin': true,
                      [font('lr', 6)]: true,
                    })}
                  >
                    Contains:{' '}
                    {childManifestsCount > 0
                      ? `${childManifestsCount} volumes`
                      : imageCount > 0
                      ? `${imageCount} ${imageCount === 1 ? 'image' : 'images'}`
                      : ''}
                  </p>
                </Space>
              )}
            </>
          )}
          {license && (
            <>
              <Space
                v={{
                  size: 'l',
                  properties: ['margin-top'],
                }}
              >
                <WorkDetailsText title="License" text={[license.label]} />
              </Space>
              <Space
                v={{
                  size: 'l',
                  properties: ['margin-top'],
                }}
              >
                <ExplanatoryText
                  id="licenseDetail"
                  controlText="Can I use this?"
                >
                  <>
                    {license.humanReadableText.length > 0 && (
                      <WorkDetailsText text={license.humanReadableText} />
                    )}

                    <WorkDetailsText
                      text={[
                        `Credit: ${work.title.replace(/\.$/g, '')}.${' '}
            ${
              credit
                ? `Credit: <a href="https://wellcomecollection.org/works/${work.id}">${credit}</a>. `
                : ` `
            }
          ${
            license.url
              ? `<a href="${license.url}">${license.label}</a>`
              : license.label
          }`,
                      ]}
                    />
                  </>
                </ExplanatoryText>
              </Space>
            </>
          )}
        </WorkDetailsSection>
      )}

      {!digitalLocation && (locationOfWork || encoreLink) && <WhereToFindIt />}

      {work.images && work.images.length > 0 && (
        <WorkDetailsSection
          headingText="Selected images from this work"
          isInArchive={isInArchive}
        >
          <ButtonOutlinedLink
            text={
              work.images.length > 1
                ? `View ${work.images.length} images`
                : 'View 1 image'
            }
            link={worksLink(
              {
                search: 'images',
                query: work.id,
              },
              'work_details/images'
            )}
          />
        </WorkDetailsSection>
      )}

      <WorkDetailsSection
        headingText="About this work"
        isInArchive={isInArchive}
      >
        {work.alternativeTitles.length > 0 && (
          <WorkDetailsText
            title="Also known as"
            text={work.alternativeTitles}
          />
        )}

        {work.description && (
          <WorkDetailsText title="Description" text={[work.description]} />
        )}

        {work.production.length > 0 && (
          <WorkDetailsText
            title="Publication/Creation"
            text={work.production.map(productionEvent => productionEvent.label)}
          />
        )}

        {work.physicalDescription && (
          <WorkDetailsText
            title="Physical description"
            text={[work.physicalDescription]}
          />
        )}

        {work.contributors.length > 0 && (
          <WorkDetailsTags
            title="Contributors"
            tags={work.contributors.map(contributor => ({
              textParts: [contributor.agent.label],
              linkAttributes: worksLink(
                {
                  query: `"${contributor.agent.label}"`,
                },
                'work_details/contributors'
              ),
            }))}
          />
        )}

        {orderedNotes.map(note => (
          <WorkDetailsText
            key={note.noteType.label}
            title={note.noteType.label}
            text={note.contents}
          />
        ))}

        {work.lettering && (
          <WorkDetailsText title="Lettering" text={[work.lettering]} />
        )}

        {work.edition && (
          <WorkDetailsText title="Edition" text={[work.edition]} />
        )}

        {duration && <WorkDetailsText title="Duration" text={[duration]} />}

        {remainingNotes.map(note => (
          <WorkDetailsText
            key={note.noteType.label}
            title={note.noteType.label}
            text={note.contents}
          />
        ))}

        {work.genres.length > 0 && (
          <WorkDetailsTags
            title="Type/Technique"
            tags={work.genres.map(g => {
              return {
                textParts: g.concepts.map(c => c.label),
                linkAttributes: worksLink(
                  {
                    query: `"${g.label}"`,
                  },
                  'work_details/genres'
                ),
              };
            })}
          />
        )}

        {work.language && (
          <WorkDetailsLinks
            title="Language"
            links={[work.language && work.language.label]}
          />
        )}
      </WorkDetailsSection>
      {work.subjects.length > 0 && (
        <WorkDetailsSection headingText="Subjects" isInArchive={isInArchive}>
          <WorkDetailsTags
            title={null}
            tags={work.subjects.map(s => {
              return {
                textParts: s.concepts.map(c => c.label),
                linkAttributes: worksLink(
                  {
                    query: `"${s.label}"`,
                  },
                  'work_details/subjects'
                ),
              };
            })}
          />
        </WorkDetailsSection>
      )}

      {digitalLocation && (locationOfWork || encoreLink) && <WhereToFindIt />}

      <WorkDetailsSection
        headingText="Permanent link"
        isInArchive={isInArchive}
      >
        <div className={`${font('hnl', 5)}`}>
          <CopyUrl
            id={work.id}
            url={`https://wellcomecollection.org/works/${work.id}`}
          />
        </div>
      </WorkDetailsSection>

      {(isbnIdentifiers.length > 0 || work.citeAs) && (
        <WorkDetailsSection headingText="Identifiers" isInArchive={isInArchive}>
          {isbnIdentifiers.length > 0 && (
            <WorkDetailsList
              title="ISBN"
              list={isbnIdentifiers.map(id => id.value)}
            />
          )}
          {work.citeAs && (
            <WorkDetailsText title="Reference number" text={[work.citeAs]} />
          )}
        </WorkDetailsSection>
      )}
    </>
  );

  return (
    <TogglesContext.Consumer>
      {({ archivesPrototype }) =>
        archivesPrototype && isInArchive ? (
          <div className="container">
            <div className="grid">
              <Content />
            </div>
          </div>
        ) : (
          <Space
            v={{
              size: 'xl',
              properties: ['padding-top', 'padding-bottom'],
            }}
            className={classNames({
              row: true,
            })}
          >
            <Layout12>
              <Content />
            </Layout12>
          </Space>
        )
      }
    </TogglesContext.Consumer>
  );
};

export default WorkDetails;
