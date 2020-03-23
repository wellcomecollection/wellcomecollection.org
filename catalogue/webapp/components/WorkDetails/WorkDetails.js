// @flow
import moment from 'moment';
import { useEffect, useState, useRef } from 'react';
import { type IIIFManifest } from '@weco/common/model/iiif';
import { type Work } from '@weco/common/model/work';
import type { NextLinkType } from '@weco/common/model/next-link-type';
import merge from 'lodash.merge';
import { font, classNames } from '@weco/common/utils/classnames';
import { downloadUrl } from '@weco/common/services/catalogue/urls';
import { worksLink } from '@weco/common/services/catalogue/routes';
import getStacksWork from '@weco/catalogue/services/stacks/items';
import {
  getDownloadOptionsFromImageUrl,
  getDigitalLocationOfType,
  getWorkIdentifiersWith,
  getEncoreLink,
  sierraIdFromPresentationManifestUrl,
  getItemsWithPhysicalLocation,
  type PhysicalItemAugmented,
} from '@weco/common/utils/works';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';
import {
  getAudio,
  getVideo,
  getDownloadOptionsFromManifest,
  getIIIFPresentationCredit,
} from '@weco/common/utils/iiif';
import { getUserHolds } from '../../services/stacks/requests';
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
import LogInButton from '../LogInButton/LogInButton';
import VideoPlayer from '@weco/common/views/components/VideoPlayer/VideoPlayer';
import AudioPlayer from '@weco/common/views/components/AudioPlayer/AudioPlayer';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import ExplanatoryText from '@weco/common/views/components/ExplanatoryText/ExplanatoryText';
import type { DigitalLocation } from '@weco/common/utils/works';
import { trackEvent } from '@weco/common/utils/ga';
import ResponsiveTable from '@weco/common/views/components/styled/ResponsiveTable';
import useAuth from '@weco/common/hooks/useAuth';
import Checkbox from '@weco/common/views/components/Checkbox/Checkbox';
import Modal from '@weco/common/views/components/Modal/Modal';
import ItemRequestButton from '@weco/catalogue/components/ItemRequestButton/ItemRequestButton';

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
  const [itemsWithPhysicalLocations, setItemsWithPhysicalLocations] = useState<
    PhysicalItemAugmented[]
  >(getItemsWithPhysicalLocation(work));
  const itemsRef = useRef(itemsWithPhysicalLocations);
  itemsRef.current = itemsWithPhysicalLocations;
  const [hasRequestableItems, setHasRequestableItems] = useState(false);
  const singleItem = itemsWithPhysicalLocations.length === 1;
  useEffect(() => {
    const fetchWork = async () => {
      const stacksWork = await getStacksWork({ workId: work.id });
      var merged = itemsRef.current.map(physicalItem => {
        const matchingItem = stacksWork.items.find(
          item => item.id === physicalItem.id
        );
        const physicalItemLocation = physicalItem.locations.find(
          location => location.type === 'PhysicalLocation'
        );
        const physicalItemLocationType =
          physicalItemLocation && physicalItemLocation.locationType;
        const physicalItemLocationLabel =
          physicalItemLocationType && physicalItemLocationType.label;
        const inClosedStores =
          physicalItemLocationLabel &&
          physicalItemLocationLabel.match(/[Cc]losed stores/);
        const requestable = Boolean(
          inClosedStores &&
            matchingItem.status &&
            matchingItem.status.label === 'Available'
        );
        return {
          ...physicalItem,
          ...matchingItem,
          requestable: requestable,
          checked: !!(requestable && singleItem),
        };
      });
      setItemsWithPhysicalLocations(merged);
    };

    fetchWork();
  }, []);

  useEffect(() => {
    setHasRequestableItems(
      Boolean(itemsWithPhysicalLocations.find(item => item.requestable))
    );
  }, [itemsWithPhysicalLocations]);

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

  const authState = useAuth();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  useEffect(() => {
    if (authState.type === 'authorized') {
      getUserHolds({ token: authState.token.id_token })
        .then(userHolds => {
          const itemsOnHold = userHolds.results.map(hold => {
            return hold.item.id;
          });
          const newArray = itemsRef.current.map(item => {
            if (itemsOnHold.includes(item.id)) {
              return {
                ...item,
                requestable: false,
                requested: true,
              };
            } else {
              return {
                ...item,
                requested: false,
              };
            }
          });

          setItemsWithPhysicalLocations(newArray);
        })
        .catch(console.error);
    }
  }, [authState]);

  const WhereToFindIt = () => (
    <WorkDetailsSection headingText="Where to find it">
      {locationOfWork && (
        <WorkDetailsText
          title={locationOfWork.noteType.label}
          text={locationOfWork.contents}
        />
      )}

      {encoreLink && (
        <Space
          v={{
            size: 'l',
            properties: ['margin-bottom'],
          }}
        >
          <WorkDetailsText
            text={[`<a href="${encoreLink}">Wellcome library</a>`]}
          />
        </Space>
      )}

      <TogglesContext.Consumer>
        {({ stacksRequestService }) =>
          stacksRequestService &&
          itemsWithPhysicalLocations.length > 0 && (
            <>
              <ResponsiveTable
                headings={
                  hasRequestableItems
                    ? ['', 'Location/Shelfmark', 'Status', 'Access']
                    : ['Location/Shelfmark', 'Status', 'Access']
                }
              >
                <thead>
                  <tr className={classNames({ [font('hnm', 5)]: true })}>
                    {hasRequestableItems && <th></th>}
                    <th>Location/Shelfmark</th>
                    <th>Status</th>
                    <th>Access</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsWithPhysicalLocations.map(item => (
                    <tr
                      key={item.id}
                      className={classNames({ [font('hnm', 5)]: true })}
                    >
                      {hasRequestableItems && (
                        <td style={{ padding: '0' }}>
                          <span hidden={singleItem}>
                            {item.requestable && (
                              <>
                                <label className="visually-hidden">
                                  Request {item.id}
                                </label>
                                <Checkbox
                                  id={item.id}
                                  text=""
                                  checked={item.checked}
                                  name={item.id}
                                  value={item.id}
                                  onChange={() => {
                                    const newArray = itemsWithPhysicalLocations.map(
                                      i => {
                                        if (item.id === i.id) {
                                          return { ...i, checked: !i.checked };
                                        } else {
                                          return i;
                                        }
                                      }
                                    );

                                    setItemsWithPhysicalLocations(newArray);
                                  }}
                                />
                              </>
                            )}
                          </span>
                        </td>
                      )}
                      <td>
                        <span
                          className={classNames({ [font('hnl', 5)]: true })}
                        >
                          {(function() {
                            const physicalLocation = item.locations.find(
                              location => location.type === 'PhysicalLocation'
                            );
                            return physicalLocation
                              ? physicalLocation.label
                              : null;
                          })()}
                        </span>
                      </td>
                      <td>
                        <span
                          className={classNames({
                            [font('hnl', 5)]: true,
                          })}
                        >
                          {item.requestSucceeded ? (
                            'You have requested this item'
                          ) : (
                            <span data-test-id="itemStatus">
                              {(item.requested &&
                                'You have requested this item') ||
                                (item.status && item.status.label) ||
                                'Unknown'}
                            </span>
                          )}
                        </span>
                      </td>
                      <td>
                        <span
                          className={classNames({ [font('hnl', 5)]: true })}
                        >
                          {item.requestable ? 'Online request' : 'In library'}
                          {/* TODO check logic and wording is correct */}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ResponsiveTable>
              {itemsWithPhysicalLocations.find(item => item.requestable) && (
                <>
                  {authState.type === 'unauthorized' ? (
                    <LogInButton
                      workId={work.id}
                      loginUrl={authState.loginUrl}
                    />
                  ) : (
                    <>
                      <div data-test-id="requestModalCTA">
                        <Button
                          type="primary"
                          text="Request"
                          clickHandler={() => {
                            if (
                              itemsWithPhysicalLocations.find(
                                item => item.checked
                              )
                            ) {
                              setShowRequestModal(!showRequestModal);
                            } else {
                              window.alert('please make a selection');
                            }
                          }}
                        />

                        <Modal
                          isActive={showRequestModal}
                          setIsActive={setShowRequestModal}
                        >
                          {/* TODO move back into own component? */}
                          <ResponsiveTable
                            headings={
                              itemsWithPhysicalLocations.find(
                                item => item.requestable
                              )
                                ? ['', 'Location/Shelfmark', 'Status', 'Access']
                                : ['Location/Shelfmark', 'Status', 'Access']
                            }
                          >
                            <thead>
                              <tr
                                className={classNames({
                                  [font('hnm', 5)]: true,
                                })}
                              >
                                {itemsWithPhysicalLocations.find(
                                  item => item.requestable
                                ) && <th></th>}
                                <th>Location/Shelfmark</th>
                                <th>Status</th>
                                <th>Access</th>
                              </tr>
                            </thead>
                            <tbody>
                              {itemsWithPhysicalLocations.map(item => (
                                <tr
                                  key={item.id}
                                  className={classNames({
                                    [font('hnm', 5)]: true,
                                  })}
                                >
                                  <td>
                                    <span hidden={singleItem}>
                                      {item.requestable && (
                                        <>
                                          <label className="visually-hidden">
                                            Request {item.id}
                                          </label>
                                          <Checkbox
                                            id={item.id}
                                            text=""
                                            checked={item.checked}
                                            name={item.id}
                                            value={item.id}
                                            onChange={() => {
                                              const newArray = itemsWithPhysicalLocations.map(
                                                i => {
                                                  if (item.id === i.id) {
                                                    return {
                                                      ...i,
                                                      checked: !i.checked,
                                                    };
                                                  } else {
                                                    return i;
                                                  }
                                                }
                                              );

                                              setItemsWithPhysicalLocations(
                                                newArray
                                              );
                                            }}
                                          />
                                        </>
                                      )}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className={classNames({
                                        [font('hnl', 5)]: true,
                                      })}
                                    >
                                      {(function() {
                                        const physicalLocation = item.locations.find(
                                          location =>
                                            location.type === 'PhysicalLocation'
                                        );
                                        return physicalLocation
                                          ? physicalLocation.label
                                          : null;
                                      })()}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className={classNames({
                                        [font('hnl', 5)]: true,
                                      })}
                                    >
                                      {item.requestSucceeded ? (
                                        'You have requested this item'
                                      ) : (
                                        <span data-test-id="itemStatus">
                                          {(item.requested &&
                                            'You have requested this item') ||
                                            (item.status &&
                                              item.status.label) ||
                                            'Unknown'}
                                        </span>
                                      )}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className={classNames({
                                        [font('hnl', 5)]: true,
                                      })}
                                    >
                                      {item.requestable
                                        ? 'Online request'
                                        : 'In library'}{' '}
                                      {/* TODO in library not accurate if requested but status hasn't changed yet */}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </ResponsiveTable>
                          <div>
                            <ItemRequestButton
                              itemsWithPhysicalLocations={
                                itemsWithPhysicalLocations
                              }
                              setItemsWithPhysicalLocations={
                                setItemsWithPhysicalLocations
                              }
                              setShowRequestModal={setShowRequestModal}
                              setShowResultsModal={setShowResultsModal}
                            />
                          </div>
                        </Modal>
                      </div>

                      <div data-test-id="resultsModalCTA">
                        <Modal
                          isActive={showResultsModal}
                          setIsActive={setShowResultsModal}
                        >
                          <ul>
                            {itemsWithPhysicalLocations
                              .filter(item => item.requested)
                              .map(item => (
                                <li key={item.id}>
                                  <span
                                    className={classNames({
                                      [font('hnl', 5)]: true,
                                    })}
                                  >
                                    {(function() {
                                      const physicalLocation = item.locations.find(
                                        location =>
                                          location.type === 'PhysicalLocation'
                                      );
                                      return physicalLocation
                                        ? physicalLocation.label
                                        : null;
                                    })()}
                                    {`: ${
                                      item.requestSucceeded
                                        ? 'item has been requested'
                                        : 'item request failed'
                                    }`}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </Modal>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
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
