import NextLink from 'next/link';
import { FunctionComponent, useContext } from 'react';
import { font } from '@weco/common/utils/classnames';
import { toLink as worksLink } from '../WorksLink';
import { toLink as imagesLink } from '../ImagesLink';
import {
  getDigitalLocationInfo,
  getDigitalLocationOfType,
  getDownloadOptionsFromImageUrl,
  getHoldings,
  getItemsWithPhysicalLocation,
  getLocationLabel,
  getLocationLink,
  getLocationShelfmark,
} from '../../utils/works';
import Space from '@weco/common/views/components/styled/Space';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import Download from '../Download/Download';
import WorkDetailsSection from '../WorkDetailsSection/WorkDetailsSection';
import WorkDetailsText from '../WorkDetailsText/WorkDetailsText';
import WorkDetailsList from '../WorkDetailsList/WorkDetailsList';
import WorkDetailsTags from '../WorkDetailsTags/WorkDetailsTags';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import AudioList from '../AudioList/AudioList';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import CollapsibleContent from '@weco/common/views/components/CollapsibleContent';
import { toLink as itemLink } from '../ItemLink';
import { toLink as conceptLink } from '../ConceptLink';
import { trackGaEvent } from '@weco/common/utils/ga';
import PhysicalItems from '../PhysicalItems/PhysicalItems';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import { DigitalLocation } from '@weco/common/model/catalogue';
import {
  Work,
  toWorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import useTransformedManifest from '../../hooks/useTransformedManifest';
import useTransformedIIIFImage from '../../hooks/useTransformedIIIFImage';
import IIIFClickthrough from '../IIIFClickthrough/IIIFClickthrough';
import OnlineResources from './OnlineResources';
import ExpandableList from '@weco/common/views/components/ExpandableList/ExpandableList';
import IsArchiveContext from '../IsArchiveContext/IsArchiveContext';
import LibraryMembersBar from '../LibraryMembersBar/LibraryMembersBar';
import { eye } from '@weco/common/icons';
import {
  itemIsRequestable,
  itemIsTemporarilyUnavailable,
} from '../../utils/requesting';
import { themeValues } from '@weco/common/views/themes/config';
import { formatDuration } from '@weco/common/utils/format-date';
import { CopyContent, CopyUrl } from '@weco/content/components/CopyButtons';

type Props = {
  work: Work;
  shouldShowItemLink: boolean;
};

const WorkDetails: FunctionComponent<Props> = ({
  work,
  shouldShowItemLink,
}: Props) => {
  const isArchive = useContext(IsArchiveContext);
  const itemUrl = itemLink({ workId: work.id, source: 'work', props: {} });
  const transformedIIIFImage = useTransformedIIIFImage(toWorkBasic(work));
  const transformedIIIFManifest = useTransformedManifest(work);
  const {
    video,
    iiifCredit,
    downloadEnabled,
    downloadOptions: manifestDownloadOptions,
    collectionManifestsCount,
    canvasCount,
    audio,
    clickThroughService,
    tokenService,
  } = { ...transformedIIIFManifest };

  const iiifImageLocation = getDigitalLocationOfType(work, 'iiif-image');
  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );

  // Works can have a DigitalLocation of type iiif-presentation and/or iiif-image.
  // For a iiif-presentation DigitalLocation we get the download options from the manifest to which it points.
  // For a iiif-image DigitalLocation we create the download options
  // from a combination of the DigitalLocation and the iiif-image json to which it points.
  // The json provides the image width and height used in the link text.
  // Since this isn't vital to rendering the links, the useTransformedIIIFImage hook
  // gets this data client side.
  const iiifImageLocationUrl = iiifImageLocation?.url;
  const iiifImageDownloadOptions = iiifImageLocationUrl
    ? getDownloadOptionsFromImageUrl({
        url: iiifImageLocationUrl,
        width: transformedIIIFImage?.width,
        height: transformedIIIFImage?.height,
      })
    : [];

  const downloadOptions = [
    ...(manifestDownloadOptions || []),
    ...iiifImageDownloadOptions,
  ];

  // Determine digital location. If the work has a iiif-presentation location and a iiif-image location
  // we use the former
  const digitalLocation: DigitalLocation | undefined =
    iiifPresentationLocation || iiifImageLocation;
  const digitalLocationInfo =
    digitalLocation && getDigitalLocationInfo(digitalLocation);

  // iiif-image locations have credit info.
  // iiif-presentation locations don't have credit info., so we fall back to the data in the manifest
  const credit = digitalLocation?.credit || iiifCredit;

  // 'About this work' data
  const duration = work.duration && formatDuration(work.duration);

  // 'Identifiers' data
  const isbnIdentifiers = work.identifiers.filter(id => {
    return id.identifierType.id === 'isbn';
  });

  const issnIdentifiers = work.identifiers.filter(id => {
    return id.identifierType.id === 'issn';
  });

  const accessionNumberIdentifiers = work.identifiers.filter(id => {
    return id.identifierType.id === 'wellcome-accession-number';
  });

  const hasIdentifiers =
    isbnIdentifiers.length > 0 ||
    issnIdentifiers.length > 0 ||
    accessionNumberIdentifiers.length > 0;

  const seriesPartOfs = work.partOf.filter(p => !p.id);

  const physicalItems = getItemsWithPhysicalLocation(work.items ?? []);

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
    return ![...orderedNotes, locationOfWork].some(n => n === note);
  });

  function determineDownloadVisibility(downloadEnabled: boolean | undefined) {
    if (digitalLocationInfo?.accessCondition === 'open-with-advisory') {
      return false;
    } else {
      return downloadEnabled !== undefined ? downloadEnabled : true;
    }
  }

  const showDownloadOptions = determineDownloadVisibility(downloadEnabled);

  const holdings = getHoldings(work);

  const showAvailableOnlineSection =
    digitalLocation &&
    (shouldShowItemLink || (audio?.sounds || []).length > 0 || video);

  const renderWhereToFindIt = () => {
    return (
      <WorkDetailsSection headingText="Where to find it">
        {physicalItems.some(
          item => itemIsRequestable(item) || itemIsTemporarilyUnavailable(item)
        ) && (
          <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
            <LibraryMembersBar />
          </Space>
        )}
        {locationOfWork && (
          <WorkDetailsText
            title={locationOfWork.noteType.label}
            html={locationOfWork.contents}
            allowDangerousRawHtml={true}
          />
        )}
        <PhysicalItems work={work} items={physicalItems} />
      </WorkDetailsSection>
    );
  };

  const renderHoldings = () => {
    return (
      <>
        {holdings.length > 0 ? (
          <WorkDetailsSection headingText="Holdings">
            {holdings.map((holding, i) => {
              const locationLabel =
                holding.location && getLocationLabel(holding.location);
              const locationShelfmark =
                holding.location && getLocationShelfmark(holding.location);
              const locationLink =
                holding.location && getLocationLink(holding.location);
              return (
                <Space
                  key={i}
                  v={
                    i + 1 !== holdings.length
                      ? { size: 'l', properties: ['margin-bottom'] }
                      : { size: 'l', properties: [] }
                  }
                >
                  {holding.enumeration.length > 0 && (
                    <Space
                      key={i}
                      v={{ size: 's', properties: ['margin-bottom'] }}
                    >
                      <ExpandableList
                        listItems={holding.enumeration}
                        initialItems={10}
                      />
                    </Space>
                  )}
                  <Space
                    key={i}
                    v={{ size: 's', properties: ['margin-bottom'] }}
                  >
                    {locationLink && (
                      <a className={font('intr', 5)} href={locationLink.url}>
                        {locationLink.linkText}
                      </a>
                    )}

                    {locationShelfmark && (
                      <WorkDetailsText
                        title="Location"
                        noSpacing={true}
                        text={`${locationLabel} ${locationShelfmark}`}
                      />
                    )}

                    {holding.note && (
                      <WorkDetailsText
                        title="Note"
                        inlineHeading={true}
                        noSpacing={true}
                        text={holding.note}
                      />
                    )}
                  </Space>
                </Space>
              );
            })}
          </WorkDetailsSection>
        ) : null}
      </>
    );
  };

  const renderContent = () => (
    <>
      {showAvailableOnlineSection && (
        <WorkDetailsSection headingText="Available online">
          <ConditionalWrapper
            condition={Boolean(tokenService && !shouldShowItemLink)}
            wrapper={children =>
              itemUrl && (
                <IIIFClickthrough
                  clickThroughService={clickThroughService}
                  tokenService={tokenService}
                  trackingId={work.id}
                >
                  {children}
                </IIIFClickthrough>
              )
            }
          >
            {video && (
              <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                <VideoPlayer
                  video={video}
                  // Note: because we can't prevent people from downloading videos if
                  // they're available online, any videos where we want to prevent
                  // download are restricted in Sierra.
                  //
                  // This means that any videos which can be viewed can also be downloaded.
                  //
                  // See discussion in https://wellcome.slack.com/archives/C8X9YKM5X/p1641833044030400
                  showDownloadOptions={true}
                />
              </Space>
            )}

            {audio?.sounds && audio.sounds.length > 0 && (
              <AudioList
                items={audio?.sounds || []}
                thumbnail={audio?.thumbnail}
                transcript={audio?.transcript}
                workTitle={work.title}
              />
            )}

            {shouldShowItemLink && (
              <>
                {work.thumbnail && (
                  <Space
                    v={{
                      size: 's',
                      properties: ['margin-bottom'],
                    }}
                  >
                    <ConditionalWrapper
                      condition={Boolean(itemUrl)}
                      wrapper={children =>
                        itemUrl && (
                          <NextLink
                            href={itemUrl.href}
                            as={itemUrl.as}
                            onClick={() =>
                              trackGaEvent({
                                category: 'WorkDetails',
                                action: 'follow image link',
                                label: work.id,
                              })
                            }
                          >
                            {children}
                          </NextLink>
                        )
                      }
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

                <div style={{ display: 'flex' }}>
                  {itemUrl && (
                    <Space
                      as="span"
                      h={{
                        size: 'm',
                        properties: ['margin-right'],
                      }}
                    >
                      <ButtonSolidLink
                        icon={eye}
                        text="View"
                        trackingEvent={{
                          category: 'WorkDetails',
                          action: 'follow view link',
                          label: itemUrl?.href?.query?.workId?.toString(),
                        }}
                        link={{ ...itemUrl }}
                      />
                    </Space>
                  )}

                  {showDownloadOptions && (
                    <Download
                      ariaControlsId="itemDownloads"
                      workId={work.id}
                      downloadOptions={downloadOptions}
                    />
                  )}
                </div>
                {((collectionManifestsCount && collectionManifestsCount > 0) ||
                  (canvasCount && canvasCount > 0)) && (
                  <Space
                    v={{
                      size: 'm',
                      properties: ['margin-top'],
                    }}
                  >
                    <p
                      className={`${font('lr', 6)}`}
                      style={{ marginBottom: 0 }}
                    >
                      Contains:{' '}
                      {collectionManifestsCount && collectionManifestsCount > 0
                        ? `${collectionManifestsCount} ${
                            collectionManifestsCount === 1
                              ? 'volume'
                              : 'volumes'
                          }`
                        : canvasCount && canvasCount > 0
                        ? `${canvasCount} ${
                            canvasCount === 1 ? 'image' : 'images'
                          }`
                        : ''}
                    </p>
                  </Space>
                )}
              </>
            )}
          </ConditionalWrapper>

          {digitalLocationInfo?.license && (
            <>
              <Space
                v={{
                  size: 'l',
                  properties: ['margin-top'],
                }}
              >
                <WorkDetailsText
                  title="Licence"
                  text={[digitalLocationInfo.license.label]}
                />
              </Space>
              {digitalLocation?.accessConditions[0]?.terms && (
                <Space
                  v={{
                    size: 'l',
                    properties: ['margin-top'],
                  }}
                >
                  <WorkDetailsText
                    title="Access conditions"
                    noSpacing={true}
                    text={digitalLocation?.accessConditions[0]?.terms}
                  />
                </Space>
              )}
              {/* TODO remove this hack once we figure out a better way to display copyrights
              This was a sensitive issue to fix asap 
              https://github.com/wellcomecollection/wellcomecollection.org/issues/9964 */}
              {![
                'wys2bdym',
                'avqn5jd8',
                'vsp8ce9z',
                'a3v24ekj',
                'ex597wgz',
                'erqm9zxq',
                'y2w42fqa',
                'uzcvr64w',
                'b5m8zwvd',
                'bbbwbh85',
                'y6ntecuu',
              ].includes(work.id) && (
                <Space
                  v={{
                    size: 'l',
                    properties: ['margin-top'],
                  }}
                >
                  <CollapsibleContent
                    id="licenseDetail"
                    controlText={{ defaultText: 'Licence and re-use' }}
                  >
                    <>
                      {digitalLocationInfo.license.humanReadableText && (
                        <WorkDetailsText
                          contents={
                            <>
                              <p>
                                <strong>
                                  {digitalLocationInfo.license.label} (
                                  {digitalLocationInfo.license.id})
                                </strong>
                              </p>
                              {digitalLocationInfo.license.humanReadableText}
                            </>
                          }
                        />
                      )}
                      <WorkDetailsText
                        contents={
                          <>
                            <p>
                              <strong>Credit</strong>
                            </p>

                            <CopyContent
                              CTA="Copy credit information"
                              content={`${work.title.replace(/\.$/g, '')}. ${
                                digitalLocationInfo.license.label
                              }. ${
                                credit && `Source: ${credit}.`
                              } https://wellcomecollection.org/works/${
                                work.id
                              }`}
                              displayedContent={
                                <p>
                                  {work.title.replace(/\.$/g, '')}.
                                  {/* Which is which? */}
                                  {credit && (
                                    <>
                                      {' '}
                                      <a
                                        href={`https://wellcomecollection.org/works/${work.id}`}
                                      >
                                        {credit}
                                      </a>
                                      .
                                    </>
                                  )}{' '}
                                  {digitalLocationInfo.license.label}.
                                  {/* Which is which? */}
                                  {credit && <> Source: {credit}.</>}
                                </p>
                              }
                            />
                          </>
                        }
                      />
                    </>
                  </CollapsibleContent>
                </Space>
              )}
            </>
          )}
        </WorkDetailsSection>
      )}

      <OnlineResources work={work} />

      {work.images && work.images.length > 0 && (
        <WorkDetailsSection headingText="Selected images from this work">
          <ButtonSolidLink
            dataGtmTrigger="view_selected_images"
            colors={themeValues.buttonColors.greenTransparentGreen}
            text={
              work.images.length > 1
                ? `View ${work.images.length} images`
                : 'View 1 image'
            }
            link={imagesLink(
              {
                query: work.id,
              },
              'work_details/images'
            )}
          />
        </WorkDetailsSection>
      )}

      <WorkDetailsSection headingText="About this work">
        {/*
          Note: although alternative titles sometimes contain angle brackets, it's
          normally used to denote a period of time, not HTML tags.

          e.g. Florida Historical Society quarterly, Apr. 1908-<July 1909>
        */}
        {work.alternativeTitles.length > 0 && (
          <WorkDetailsText
            title="Also known as"
            text={work.alternativeTitles}
          />
        )}

        {work.description && (
          <WorkDetailsText
            title="Description"
            html={work.description}
            allowDangerousRawHtml={true}
          />
        )}

        {/*
          Note: although production event labels sometimes contain angle brackets, it's
          normally used to denote a period of time, not HTML tags.

          e.g. London : County Council, 1900-<1983>
        */}
        {work.production.length > 0 && (
          <WorkDetailsText
            title="Publication/Creation"
            text={work.production.map(productionEvent => productionEvent.label)}
          />
        )}
        {work.currentFrequency && (
          <WorkDetailsText
            title="Current frequency"
            text={work.currentFrequency}
          />
        )}
        {work.formerFrequency.length > 0 && (
          <WorkDetailsText
            title="Former frequency"
            text={work.formerFrequency}
          />
        )}
        {work.designation.length > 0 && (
          <WorkDetailsText title="Designation" text={work.designation} />
        )}
        {work.physicalDescription && (
          <WorkDetailsText
            title="Physical description"
            html={work.physicalDescription}
            allowDangerousRawHtml={true}
          />
        )}
        {seriesPartOfs.length > 0 && (
          // Only show partOfs with no id here.
          // A partOf object with an id will be represented in
          // the archive hierarchy.
          // partOfs with no id are Series Links.
          <WorkDetailsTags
            title="Series"
            tags={seriesPartOfs.map(partOf => ({
              textParts: [partOf.title],
              linkAttributes: worksLink(
                {
                  'partOf.title': partOf.title,
                },
                'work_details/partOf'
              ),
            }))}
          />
        )}
        {work.contributors.length > 0 && (
          <WorkDetailsTags
            title="Contributors"
            tags={work.contributors.map(contributor => {
              const textParts = [
                contributor.agent.label,
                ...contributor.roles.map(role => role.label),
              ];
              /*
              If this is an identified contributor, link to the concepts prototype
              page instead.
              */
              return contributor.agent.id
                ? {
                    textParts,
                    linkAttributes: conceptLink(
                      { conceptId: contributor.agent.id },
                      'work_details/contributors'
                    ),
                  }
                : {
                    textParts,
                    linkAttributes: worksLink(
                      {
                        'contributors.agent.label': [contributor.agent.label],
                      },
                      'work_details/contributors'
                    ),
                  };
            })}
            separator=""
          />
        )}

        {orderedNotes.map(note => (
          <WorkDetailsText
            key={note.noteType.label}
            title={note.noteType.label}
            html={note.contents}
            allowDangerousRawHtml={true}
          />
        ))}

        {/*
          Note: although angle brackets are sometimes used in the lettering field,
          it's usually to denote missing or unclear text, not HTML.

          e.g. Patient <...>, sup<erior> mesenteric a<rtery>
          */}
        {work.lettering && (
          <WorkDetailsText title="Lettering" text={work.lettering} />
        )}

        {work.edition && (
          <WorkDetailsText title="Edition" text={work.edition} />
        )}

        {duration && <WorkDetailsText title="Duration" text={duration} />}

        {remainingNotes.map(note => (
          <WorkDetailsText
            key={note.noteType.label}
            title={note.noteType.label}
            html={note.contents}
            allowDangerousRawHtml={true}
          />
        ))}
        {/*
         A genre may be simple or compound.

         A simple genre contains just one concept in its concepts list,
         whereas a compound genre may contain many.

         In both cases, the first concept is the "important" one that
         should be used to link to a concepts page.

         Compound genres behave more like contributors than subjects.
         The additional information imparted by the subsequent concepts
         are more relevant to Genre as it relates to the Work in question
         than the Genre as its own thing.
         */}
        {work.genres.length > 0 && (
          <WorkDetailsTags
            title="Type/Technique"
            tags={work.genres.map(genre => {
              return {
                textParts: genre.concepts.map(c => c.label),

                linkAttributes: conceptLink(
                  { conceptId: genre.concepts[0].id as string },
                  'work_details/genres'
                ),
              };
            })}
          />
        )}

        {work.languages.length > 0 && (
          <WorkDetailsTags
            title="Languages"
            tags={work.languages.map(lang => {
              return {
                textParts: [lang.label],
                linkAttributes: worksLink(
                  {
                    languages: [lang.id],
                  },
                  'work_details/languages'
                ),
              };
            })}
          />
        )}
      </WorkDetailsSection>
      {work.subjects.length > 0 && (
        <WorkDetailsSection headingText="Subjects">
          <WorkDetailsTags
            tags={work.subjects.map(s => {
              /*
              If this is an identified subject, link to the concepts prototype
              page instead.
              */
              return s.id
                ? {
                    textParts: [s.concepts[0].label].concat(
                      s.concepts.slice(1).map(c => c.label)
                    ),
                    linkAttributes: conceptLink(
                      { conceptId: s.id },
                      'work_details/subjects'
                    ),
                  }
                : {
                    textParts: s.concepts.map(c => c.label),
                    linkAttributes: worksLink(
                      {
                        'subjects.label': [s.label],
                      },
                      'work_details/subjects'
                    ),
                  };
            })}
          />
        </WorkDetailsSection>
      )}

      {renderHoldings()}

      {(locationOfWork || physicalItems.length > 0) && renderWhereToFindIt()}

      <WorkDetailsSection headingText="Permanent link">
        <div className={font('intr', 5)}>
          <CopyUrl
            id={work.id}
            url={`https://wellcomecollection.org/works/${work.id}`}
          />
        </div>
      </WorkDetailsSection>

      {hasIdentifiers && (
        <WorkDetailsSection headingText="Identifiers">
          {isbnIdentifiers.length > 0 && (
            <WorkDetailsList
              title="ISBN"
              list={isbnIdentifiers.map(id => id.value)}
            />
          )}
          {issnIdentifiers.length > 0 && (
            <WorkDetailsList
              title="ISSN"
              list={issnIdentifiers.map(id => id.value)}
            />
          )}
          {accessionNumberIdentifiers.length > 0 && (
            <WorkDetailsList
              title="Accession number"
              list={accessionNumberIdentifiers.map(id => id.value)}
            />
          )}
        </WorkDetailsSection>
      )}
    </>
  );

  return isArchive ? (
    <Space h={{ size: 'l', properties: ['padding-left', 'padding-right'] }}>
      {renderContent()}
    </Space>
  ) : (
    <Layout10>{renderContent()}</Layout10>
  );
};

export default WorkDetails;
