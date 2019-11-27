// @flow
import { type Node } from 'react';
import moment from 'moment';
import { type IIIFManifest } from '@weco/common/model/iiif';
import { font, grid, classNames } from '@weco/common/utils/classnames';
import { worksUrl, downloadUrl } from '@weco/common/services/catalogue/urls';
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
import Space from '@weco/common/views/components/styled/Space';
import { clientSideSearchParams } from '@weco/common/services/catalogue/search-params';
import Download from '../Download/Download';

type WorkDetailsSectionProps = {|
  headingText?: string,
  children: Node,
  withDivider?: boolean,
|};

const WorkDetailsSection = ({
  headingText,
  children,
  withDivider = true,
}: WorkDetailsSectionProps) => {
  return (
    <>
      {withDivider && (
        <>
          <Divider extraClasses="divider--pumice divider--keyline" />
          <SpacingComponent />
        </>
      )}
      <SpacingSection>
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
      </SpacingSection>
    </>
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
  const duration =
    work.duration && moment.utc(work.duration).format('HH:mm:ss');
  const params = clientSideSearchParams();
  const iiifImageLocation = getItemAtLocation(work, 'iiif-image');
  const iiifImageLocationUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImageLocationCredit =
    iiifImageLocation && getIIIFImageCredit(iiifImageLocation);

  const isbnIdentifiers = work.identifiers.filter(id => {
    return id.identifierType.id === 'isbn';
  });

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

  const iiifPresentationRepository =
    iiifPresentationManifest &&
    getIIIFMetadata(iiifPresentationManifest, 'Repository');

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
        {allDownloadOptions.length > 0 && (
          <>
            <SpacingSection>
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
            </SpacingSection>
          </>
        )}

        {!(allDownloadOptions.length > 0) &&
          sierraId &&
          childManifestsCount === 0 && (
            <>
              <SpacingSection>
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
              </SpacingSection>
            </>
          )}

        <WorkDetailsSection headingText="About this work">
          {showAdditionalCatalogueData && work.alternativeTitles.length > 0 && (
            <MetaUnit
              headingText="Also known as"
              text={work.alternativeTitles}
            />
          )}

          {work.description && (
            <MetaUnit headingText="Description" text={[work.description]} />
          )}

          {work.contributors.length > 0 && (
            <MetaUnit
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
            <MetaUnit headingText="Lettering" text={[work.lettering]} />
          )}

          {work.production.length > 0 && (
            <MetaUnit
              headingText="Publication/Creation"
              text={work.production.map(
                productionEvent => productionEvent.label
              )}
            />
          )}

          {showAdditionalCatalogueData && work.edition && (
            <MetaUnit headingText="Edition" text={[work.edition]} />
          )}

          {work.physicalDescription && (
            <MetaUnit
              headingText="Physical description"
              text={[work.physicalDescription]}
            />
          )}

          {showAdditionalCatalogueData && duration && (
            <MetaUnit headingText="Duration" text={[duration]} />
          )}

          {showAdditionalCatalogueData &&
            work.notes.map(note => (
              <MetaUnit
                key={note.noteType.label}
                headingText={note.noteType.label}
                text={note.contents}
              />
            ))}

          {work.genres.length > 0 && (
            <MetaUnit
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
              headingText="Language"
              links={[work.language && work.language.label]}
            />
          )}
        </WorkDetailsSection>

        {work.subjects.length > 0 && (
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
        )}

        {/* TODO: Make this make more sense */}
        {(encoreLink || iiifPresentationRepository) && (
          <WorkDetailsSection headingText="Where to find it">
            <MetaUnit
              text={[
                encoreLink && `<a href="${encoreLink}">Wellcome library</a>`,

                iiifPresentationRepository &&
                  iiifPresentationRepository.value
                    .replace(/<img[^>]*>/g, '')
                    .replace(/<br\s*\/?>/g, ''),
              ].filter(Boolean)}
            />
          </WorkDetailsSection>
        )}

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
            <MetaUnit headingText="Reference number" text={[work.citeAs]} />
          )}
        </WorkDetailsSection>

        {licenseInfo && (
          <WorkDetailsSection headingText="License information">
            <div id="licenseInformation">
              <MetaUnit
                headingText="License information"
                text={licenseInfo.humanReadableText}
              />
              <MetaUnit
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
        )}

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
