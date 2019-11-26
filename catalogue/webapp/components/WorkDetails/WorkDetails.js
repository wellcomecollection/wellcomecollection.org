// @flow
import fetch from 'isomorphic-unfetch';
import { type Node, Fragment, useState, useEffect, useContext } from 'react';
import Router from 'next/router';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import moment from 'moment';
import { type IIIFManifest } from '@weco/common/model/iiif';
import { font, grid, classNames } from '@weco/common/utils/classnames';
import {
  worksUrl,
  workUrl,
  downloadUrl,
} from '@weco/common/services/catalogue/urls';
import {
  getDownloadOptionsFromManifest,
  getIIIFMetadata,
  getDownloadOptionsFromImageUrl,
  getItemAtLocation,
} from '@weco/common/utils/works';
import {
  getIIIFPresentationLicenceInfo,
  getIIIFImageLicenceInfo,
  getIIIFPresentationCredit,
  getIIIFImageCredit,
} from '@weco/common/utils/iiif';
import NextLink from 'next/link';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import Icon from '@weco/common/views/components/Icon/Icon';
import Divider from '@weco/common/views/components/Divider/Divider';
import CopyUrl from '@weco/common/views/components/CopyUrl/CopyUrl';
import MetaUnit from '@weco/common/views/components/MetaUnit/MetaUnit';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import Auth from '@weco/common/views/components/Auth/Auth';
import Space from '@weco/common/views/components/styled/Space';
import { clientSideSearchParams } from '@weco/common/services/catalogue/search-params';

import Download from '../Download/Download';
import PaletteSimilarityBox from '../PaletteSimilarityBox/PaletteSimilarityBox';

type WorkDetailsSectionProps = {|
  headingText?: string,
  children: Node,
|};

const WorkDetailsSection = ({
  headingText,
  children,
}: WorkDetailsSectionProps) => {
  return (
    <div
      className={classNames({
        grid: true,
      })}
    >
      <div
        className={classNames({
          [grid({ s: 12, m: 12, l: 4, xl: 4 })]: true,
        })}
      >
        {headingText && (
          <h2
            className={classNames({
              [font('wb', 4)]: true,
              'work-details-heading': true,
            })}
          >
            {headingText}
          </h2>
        )}
      </div>

      <div
        className={classNames({
          [grid({ s: 12, m: 12, l: 8, xl: 7 })]: true,
        })}
      >
        {children}
      </div>
    </div>
  );
};

type Work = Object;

type Props = {|
  work: Work,
  sierraId: ?string,
  iiifPresentationManifest: ?IIIFManifest,
  encoreLink: ?string,
  childManifestsCount?: number,
  showImagesWithSimilarPalette?: boolean,
  showAdditionalCatalogueData?: boolean,
|};

const WorkDetails = ({
  work,
  sierraId,
  iiifPresentationManifest,
  encoreLink,
  childManifestsCount,
  showImagesWithSimilarPalette,
  showAdditionalCatalogueData,
}: Props) => {
  const [holds, setHolds] = useState([]);
  const [localAuthToken, setLocalAuthToken] = useState(null);
  // TODO: update UI (per item) when doing request
  const [updatingItems, setUpdatingItems] = useState([]);
  const { authPrototype } = useContext(TogglesContext);
  const [physicalLocations, setPhysicalLocations] = useState([]);
  const params = clientSideSearchParams();
  const iiifImageLocation = getItemAtLocation(work, 'iiif-image');
  const iiifImageLocationUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImageLocationCredit =
    iiifImageLocation && getIIIFImageCredit(iiifImageLocation);

  useEffect(() => {
    if (authPrototype) {
      getToRequests();
    }
  }, []);

  useEffect(() => {
    if (authPrototype) {
      fetch(
        `https://api.wellcomecollection.org/stacks/v1/items/works/${work.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': '0yYzrX1sqNoHCO2mzvND4b3BYTg8elYxFyMYw7c0',
          },
        }
      )
        .then(resp => resp.json())
        .then(({ items }) => setPhysicalLocations(items))
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    const action = Router.query.action;
    const idToken = localAuthToken && localAuthToken.id_token;

    if (action && idToken) {
      const requestItemParts = action.split('/');
      const itemId = requestItemParts[4];

      postToRequests(itemId, idToken);
    }
  }, [localAuthToken]);

  function postToRequests(itemId, idToken) {
    setUpdatingItems([...updatingItems, itemId]);

    fetch('https://api.wellcomecollection.org/stacks/v1/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: idToken,
      },
      body: JSON.stringify({
        itemId: `${itemId}`,
      }),
    })
      .then(resp => {
        console.log(resp);
        // TODO: expect to get user from the response and get their holds
        // here, then setHolds(...)
      })
      .catch(error => {
        console.log('caught error');
        console.log(error);
      })
      .finally(() => {
        setUpdatingItems(updatingItems.filter(i => i !== itemId));
        const url = workUrl({ ...Router.query });

        Router.replace(url.href, url.as);
      });
  }

  function getToRequests() {
    const idToken = window.localStorage.getItem('idToken');

    if (idToken) {
      fetch(`https://api.wellcomecollection.org/stacks/v1/requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: idToken,
        },
      })
        .then(resp => resp.json())
        .then(({ holds }) => setHolds(holds.map(h => h.itemId)))
        .catch(console.error);
    }
  }

  const isbnIdentifiers = work.identifiers.filter(id => {
    return id.identifierType.id === 'isbn';
  });

  const WorkDetailsSections = [];

  const iiifPresentationDownloadOptions = iiifPresentationManifest
    ? getDownloadOptionsFromManifest(iiifPresentationManifest)
    : [];

  const downloadOptions = iiifImageLocationUrl
    ? getDownloadOptionsFromImageUrl(iiifImageLocationUrl)
    : [];

  const allDownloadOptions = [
    ...downloadOptions,
    ...iiifPresentationDownloadOptions,
  ];

  const iiifPresentationLicenseInfo =
    iiifPresentationManifest &&
    getIIIFPresentationLicenceInfo(iiifPresentationManifest);

  const iiifImageLicenseInfo =
    iiifImageLocation && getIIIFImageLicenceInfo(iiifImageLocation);

  const iiifPresentationCredit =
    iiifPresentationManifest &&
    getIIIFPresentationCredit(iiifPresentationManifest);

  const licenseInfo = iiifImageLicenseInfo || iiifPresentationLicenseInfo;
  const credit = iiifPresentationCredit || iiifImageLocationCredit;

  const duration =
    work.duration && moment.utc(work.duration).format('HH:mm:ss');

  const iiifPresentationRepository =
    iiifPresentationManifest &&
    getIIIFMetadata(iiifPresentationManifest, 'Repository');

  if (allDownloadOptions.length > 0) {
    WorkDetailsSections.push(
      <div
        className={classNames({
          grid: true,
        })}
      >
        <div
          className={classNames({
            [grid({
              s: 12,
              m: 12,
              l: 10,
              xl: 10,
            })]: true,
          })}
        >
          <Download
            work={work}
            licenseInfo={licenseInfo}
            credit={credit}
            downloadOptions={allDownloadOptions}
            licenseInfoLink={true}
          />
        </div>
      </div>
    );
  } else if (sierraId && childManifestsCount === 0) {
    WorkDetailsSections.push(
      <div
        className={classNames({
          grid: true,
        })}
      >
        <div
          className={classNames({
            [grid({
              s: 12,
              m: 12,
              l: 10,
              xl: 10,
            })]: true,
          })}
        >
          <NextLink
            {...downloadUrl({
              workId: work.id,
              sierraId: sierraId,
            })}
          >
            <a>Download options</a>
          </NextLink>
        </div>
      </div>
    );
  }
  if (
    work.description ||
    work.contributors ||
    work.production.length > 0 ||
    work.physicalDescription ||
    work.lettering ||
    work.genres.length > 0 ||
    work.language ||
    (showAdditionalCatalogueData &&
      (work.alternativeTitles ||
        work.dissertation ||
        work.edition ||
        work.duration ||
        work.notes ||
        work.contents ||
        work.credits))
  ) {
    WorkDetailsSections.push(
      <WorkDetailsSection headingText="About this work">
        {showAdditionalCatalogueData && work.alternativeTitles && (
          <MetaUnit
            headingLevel={3}
            headingText="Also known as"
            text={work.alternativeTitles}
          />
        )}

        {work.description && (
          <MetaUnit
            headingLevel={3}
            headingText="Description"
            text={[work.description]}
          />
        )}

        {work.contributors.length > 0 && (
          <MetaUnit
            headingLevel={3}
            headingText="Contributors"
            tags={work.contributors.map(contributor => ({
              textParts: [contributor.agent.label],
              linkAttributes: worksUrl({
                ...params,
                query: `"${contributor.agent.label}"`,
                page: 1,
              }),
            }))}
          />
        )}

        {work.lettering && (
          <MetaUnit
            headingLevel={3}
            headingText="Lettering"
            text={[work.lettering]}
          />
        )}

        {showAdditionalCatalogueData && work.dissertation && (
          <MetaUnit
            headingLevel={3}
            headingText="Thesis information"
            text={[work.dissertation]}
          />
        )}

        {work.production.length > 0 && (
          <MetaUnit
            headingLevel={3}
            headingText="Publication/Creation"
            text={work.production.map(productionEvent => productionEvent.label)}
          />
        )}

        {showAdditionalCatalogueData && work.edition && (
          <MetaUnit
            headingLevel={3}
            headingText="Edition"
            text={[work.edition]}
          />
        )}

        {work.physicalDescription && (
          <MetaUnit
            headingLevel={3}
            headingText="Physical description"
            text={[work.physicalDescription]}
          />
        )}

        {showAdditionalCatalogueData && duration && (
          <MetaUnit headingLevel={3} headingText="Duration" text={[duration]} />
        )}

        {showAdditionalCatalogueData && work.notes && (
          <MetaUnit
            headingLevel={3}
            headingText="Notes"
            text={work.notes
              .map(note => note.contents)
              .reduce((acc, arr) => acc.concat(arr), [])}
          />
        )}

        {showAdditionalCatalogueData && work.contents && (
          <MetaUnit
            headingLevel={3}
            headingText="Contents"
            text={[work.contents]}
          />
        )}

        {showAdditionalCatalogueData && work.credits && (
          <MetaUnit
            headingLevel={3}
            headingText="Credits"
            text={[work.credits]}
          />
        )}

        {work.genres.length > 0 && (
          <MetaUnit
            headingLevel={3}
            headingText="Type/Technique"
            tags={work.genres.map(g => {
              return {
                textParts: g.concepts.map(c => c.label),
                linkAttributes: worksUrl({
                  ...params,
                  query: `"${g.label}"`,
                  page: 1,
                }),
              };
            })}
          />
        )}

        {work.language && (
          <MetaUnit
            headingLevel={3}
            headingText="Language"
            links={[work.language.label]}
          />
        )}
      </WorkDetailsSection>
    );
  }
  if (work.subjects.length > 0) {
    WorkDetailsSections.push(
      <WorkDetailsSection headingText="Subjects">
        <MetaUnit
          tags={work.subjects.map(s => {
            return {
              textParts: s.concepts.map(c => c.label),
              linkAttributes: worksUrl({
                ...params,
                query: `"${s.label}"`,
                page: 1,
              }),
            };
          })}
        />
      </WorkDetailsSection>
    );
  }
  if (
    encoreLink ||
    iiifPresentationRepository ||
    work.locationOfOriginal ||
    physicalLocations
  ) {
    const textArray = [
      encoreLink && `<a href="${encoreLink}">Wellcome library</a>`,
      (showAdditionalCatalogueData && work.locationOfOriginal) ||
        (iiifPresentationRepository &&
          iiifPresentationRepository.value
            .replace(/<img[^>]*>/g, '')
            .replace(/<br\s*\/?>/g, '')),
    ].filter(Boolean);
    (textArray.length > 0 || physicalLocations.length > 0) &&
      WorkDetailsSections.push(
        <WorkDetailsSection headingText="Where to find it">
          {textArray && <MetaUnit text={textArray} />}
          {physicalLocations.length > 0 && (
            <Auth
              authTokenUpdatedHandler={setLocalAuthToken}
              render={({ user, authState, loginUrl, authToken }) => {
                return (
                  <Space v={{ size: 'm', properties: ['margin-top'] }}>
                    {physicalLocations.map(item => (
                      <Fragment key={item.id.catalogueId.value}>
                        {holds.includes(item.id.catalogueId.value) ? (
                          <span>
                            {item.location.label}: You have placed a hold on
                            this item
                          </span>
                        ) : (
                          <>
                            {authState === 'authorising' && <p>Authorising…</p>}
                            {authState === 'loggedOut' && (
                              <>
                                {item.status.id === 'available' ? (
                                  <a
                                    className="btn btn--tertiary"
                                    onClick={event => {
                                      const searchParams = new URLSearchParams(
                                        window.location.search
                                      );
                                      searchParams.set(
                                        'action',
                                        `requestItem:/works/${work.id}/items/${item.id.catalogueId.value}`
                                      );

                                      const url = `${
                                        window.location.pathname
                                      }?${searchParams.toString()}`;
                                      document.cookie = `WC_auth_redirect=${url}; path=/`;
                                    }}
                                    href={loginUrl}
                                  >
                                    {item.location.label}: {item.status.label}
                                  </a>
                                ) : (
                                  <span>
                                    {item.location.label}: {item.status.label}
                                  </span>
                                )}
                              </>
                            )}
                            {authState === 'loggedIn' && (
                              <>
                                {item.status.label === 'Available' ? (
                                  <button
                                    disabled={updatingItems.includes(
                                      item.id.catalogueId.value
                                    )}
                                    className="btn btn--tertiary"
                                    onClick={() => {
                                      postToRequests(
                                        item.id.catalogueId.value,
                                        authToken.id_token
                                      );
                                    }}
                                  >
                                    <span>
                                      {updatingItems.includes(
                                        item.id.catalogueId.value
                                      ) ? (
                                        <span className="font-white">
                                          Requesting…
                                        </span>
                                      ) : (
                                        <span>
                                          {item.location.label}:{' '}
                                          {item.status.label}
                                        </span>
                                      )}
                                    </span>
                                  </button>
                                ) : (
                                  <span>
                                    {item.location.label}: {item.status.label}
                                  </span>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </Fragment>
                    ))}
                  </Space>
                );
              }}
            />
          )}
        </WorkDetailsSection>
      );
  }
  WorkDetailsSections.push(
    <WorkDetailsSection headingText="Identifiers">
      {isbnIdentifiers.length > 0 && (
        <MetaUnit
          headingText="ISBN"
          list={isbnIdentifiers.map(id => id.value)}
        />
      )}
      <MetaUnit>
        <CopyUrl
          id={work.id}
          url={`https://wellcomecollection.org/works/${work.id}`}
        />
      </MetaUnit>
      {showAdditionalCatalogueData && work.citeAs && (
        <MetaUnit
          headingLevel={3}
          headingText="Reference number"
          text={[work.citeAs]}
        />
      )}
    </WorkDetailsSection>
  );

  if (licenseInfo) {
    WorkDetailsSections.push(
      <WorkDetailsSection headingText="License information">
        <div id="licenseInformation">
          <MetaUnit
            headingLevel={3}
            headingText="License information"
            text={licenseInfo.humanReadableText}
          />
          <MetaUnit
            headingLevel={3}
            headingText="Credit"
            text={[
              `${work.title.replace(/\.$/g, '')}.${' '}
              ${
                credit
                  ? `Credit: <a href="https://wellcomecollection.org/works/${work.id}">${credit}</a>. `
                  : ` `
              }
              ${
                licenseInfo.url
                  ? `<a href="${licenseInfo.url}">${licenseInfo.text}</a>`
                  : licenseInfo.text
              }`,
            ]}
          />
        </div>
      </WorkDetailsSection>
    );
  }

  if (showImagesWithSimilarPalette) {
    WorkDetailsSections.push(
      <WorkDetailsSection headingText="Images with a similar palette">
        <PaletteSimilarityBox work={work} />
      </WorkDetailsSection>
    );
  }

  WorkDetailsSections.push(
    <WorkDetailsSection>
      <div className="flex flex--v-center">
        <Icon name="underConstruction" extraClasses="margin-right-s2" />
        <p className={`${font('hnl', 5)} no-margin`}>
          We’re improving the information on this page.{' '}
          <a href="/works/progress">Find out more</a>.
        </p>
      </div>
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
        {WorkDetailsSections.map((section, i) => {
          return (
            <Fragment key={i}>
              {i > 0 && (
                <>
                  <Divider extraClasses="divider--pumice divider--keyline" />
                  <SpacingComponent />
                </>
              )}
              <SpacingSection>{section}</SpacingSection>
            </Fragment>
          );
        })}
      </Layout12>
    </Space>
  );
};

export default WorkDetails;
