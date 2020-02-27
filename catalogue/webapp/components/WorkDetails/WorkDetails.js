// @flow
import moment from 'moment';
import { type IIIFManifest } from '@weco/common/model/iiif';
import { type Work } from '@weco/common/model/work';
import type { NextLinkType } from '@weco/common/model/next-link-type';
import merge from 'lodash.merge';
import { font, classNames } from '@weco/common/utils/classnames';
import { downloadUrl } from '@weco/common/services/catalogue/urls';
import { worksLink } from '@weco/common/services/catalogue/routes';
import {
  getDownloadOptionsFromImageUrl,
  getDigitalLocationOfType,
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
} from '@weco/common/utils/iiif';
import NextLink from 'next/link';
import Icon from '@weco/common/views/components/Icon/Icon';
import CopyUrl from '@weco/common/views/components/CopyUrl/CopyUrl';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Space from '@weco/common/views/components/styled/Space';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import Download from '../Download/Download';
import WorkDetailsSection from '../WorkDetailsSection/WorkDetailsSection';
import WorkDetailsText from '../WorkDetailsText/WorkDetailsText';
import WorkDetailsList from '../WorkDetailsList/WorkDetailsList';
import WorkDetailsLinks from '../WorkDetailsLinks/WorkDetailsLinks';
import WorkDetailsTags from '../WorkDetailsTags/WorkDetailsTags';
import WorkItemsStatus from '../WorkItemsStatus/WorkItemsStatus';
import VideoPlayer from '@weco/common/views/components/VideoPlayer/VideoPlayer';
import AudioPlayer from '@weco/common/views/components/AudioPlayer/AudioPlayer';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import ExplanatoryText from '@weco/common/views/components/ExplanatoryText/ExplanatoryText';
import type { DigitalLocation } from '@weco/common/utils/works';
import { trackEvent } from '@weco/common/utils/ga';

type Props = {|
  work: Work,
  iiifPresentationManifest: ?IIIFManifest,
  childManifestsCount: number,
  imageCount: number,
  itemUrl: ?NextLinkType,
  showAvailableOnline: boolean,
|};

const WorkDetails = ({
  work,
  iiifPresentationManifest,
  childManifestsCount,
  imageCount,
  itemUrl,
  showAvailableOnline,
}: Props) => {
  // Determin digital location
  const iiifImageLocation = getDigitalLocationOfType(work, 'iiif-image');
  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );
  const digitalLocation: ?DigitalLocation =
    iiifPresentationLocation || iiifImageLocation;

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
    ? getDownloadOptionsFromImageUrl(iiifImageLocationUrl)
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

  // 'Indentifiers' data
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
  const shouldDisplayEncoreLink = !(sierraIdFromManifestUrl === sierraWorkId);
  const encoreLink =
    shouldDisplayEncoreLink && sierraWorkId && getEncoreLink(sierraWorkId);

  const locationOfWork = work.notes.find(
    note => note.noteType.id === 'location-of-original'
  );

  const WhereToFindIt = () => (
    <WorkDetailsSection headingText="Where to find it">
      {locationOfWork && (
        <WorkDetailsText
          title={locationOfWork.noteType.label}
          text={locationOfWork.contents}
        />
      )}

      {encoreLink && (
        <WorkDetailsText
          text={[`<a href="${encoreLink}">Wellcome library</a>`]}
        />
      )}

      <TogglesContext.Consumer>
        {({ stacksRequestService }) =>
          stacksRequestService && (
            <div className={`${font('hnl', 5)}`}>
              <WorkItemsStatus workId={work.id} />
            </div>
          )
        }
      </TogglesContext.Consumer>
    </WorkDetailsSection>
  );

  return (
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
        {digitalLocation && showAvailableOnline && (
          <WorkDetailsSection headingText="Available online">
            {video && (
              <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                <VideoPlayer video={video} />
              </Space>
            )}
            {audio && (
              <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                <AudioPlayer audio={audio} />
              </Space>
            )}
            {work.thumbnail && (
              <Space
                v={{
                  size: 's',
                  properties: ['margin-bottom'],
                }}
              >
                {itemUrl ? (
                  <NextLink {...itemUrl}>
                    <a
                      onClick={trackEvent({
                        category: 'WorkDetails',
                        action: 'follow image link',
                        label: itemUrl.href.query.workId,
                      })}
                    >
                      <img
                        style={{
                          width: 'auto',
                          height: 'auto',
                        }}
                        alt={`view ${work.title}`}
                        src={work.thumbnail.url}
                      />
                    </a>
                  </NextLink>
                ) : (
                  <img
                    style={{
                      width: 'auto',
                      height: 'auto',
                    }}
                    alt={`view ${work.title}`}
                    src={work.thumbnail.url}
                  />
                )}
              </Space>
            )}
            {itemUrl && !audio && !video && (
              <>
                <Space
                  as="span"
                  h={{
                    size: 'm',
                    properties: ['margin-right'],
                  }}
                >
                  <Button
                    type="primary"
                    icon="eye"
                    text="View"
                    trackingEvent={{
                      category: 'WorkDetails',
                      action: 'follow view link',
                      label: itemUrl.href.query.workId,
                    }}
                    link={{ ...itemUrl }}
                  />
                </Space>
                {(imageCount > 4 || childManifestsCount > 1) && (
                  <Space
                    as="span"
                    h={{
                      size: 'm',
                      properties: ['margin-right'],
                    }}
                  >
                    <Button
                      type="primary"
                      icon="gridView"
                      text="Overview"
                      trackingEvent={{
                        category: 'WorkDetails',
                        action: 'follow overview link',
                        label: itemUrl.href.query.workId,
                      }}
                      link={{
                        ...merge({}, itemUrl, {
                          href: {
                            query: {
                              isOverview: true,
                            },
                          },
                          as: {
                            query: {
                              isOverview: true,
                            },
                          },
                        }),
                      }}
                    />
                  </Space>
                )}
              </>
            )}

            <Download
              ariaControlsId="itemDownloads"
              workId={work.id}
              downloadOptions={downloadOptions}
            />

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
        {!digitalLocation && (locationOfWork || encoreLink) && (
          <WhereToFindIt />
        )}
        <WorkDetailsSection headingText="About this work">
          {work.alternativeTitles.length > 0 && (
            <WorkDetailsText
              title="Also known as"
              text={work.alternativeTitles}
            />
          )}

          {work.description && (
            <WorkDetailsText title="Description" text={[work.description]} />
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

          {work.lettering && (
            <WorkDetailsText title="Lettering" text={[work.lettering]} />
          )}

          {work.production.length > 0 && (
            <WorkDetailsText
              title="Publication/Creation"
              text={work.production.map(
                productionEvent => productionEvent.label
              )}
            />
          )}

          {work.edition && (
            <WorkDetailsText title="Edition" text={[work.edition]} />
          )}

          {work.physicalDescription && (
            <WorkDetailsText
              title="Physical description"
              text={[work.physicalDescription]}
            />
          )}

          {duration && <WorkDetailsText title="Duration" text={[duration]} />}

          {work.notes
            .filter(note => note.noteType.id !== 'location-of-original')
            .map(note => (
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
          <WorkDetailsSection headingText="Subjects">
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
        <WorkDetailsSection headingText="Identifiers">
          {isbnIdentifiers.length > 0 && (
            <WorkDetailsList
              title="ISBN"
              list={isbnIdentifiers.map(id => id.value)}
            />
          )}
          <SpacingComponent>
            <div className={`${font('hnl', 5)}`}>
              <CopyUrl
                id={work.id}
                url={`https://wellcomecollection.org/works/${work.id}`}
              />
            </div>
          </SpacingComponent>
          {work.citeAs && (
            <WorkDetailsText title="Reference number" text={[work.citeAs]} />
          )}
        </WorkDetailsSection>
        <WorkDetailsSection>
          <div className="flex flex--v-center">
            <Icon name="underConstruction" extraClasses="margin-right-s2" />
            <p className={`${font('hnl', 5)} no-margin`}>
              We’re improving the information on this page.{' '}
              <a href="/works/progress">Find out more</a>.
            </p>
          </div>
        </WorkDetailsSection>
      </Layout12>
    </Space>
  );
};

export default WorkDetails;
