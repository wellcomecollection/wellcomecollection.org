// @flow
import moment from 'moment';
import { type IIIFManifest } from '@weco/common/model/iiif';
import { font, grid, classNames } from '@weco/common/utils/classnames';
import { worksUrl, downloadUrl } from '@weco/common/services/catalogue/urls';
import {
  getDownloadOptionsFromManifest,
  getDownloadOptionsFromImageUrl,
  getLocationOfType,
  getIIIFPresentationLocation,
  getWorkIdentifiersWith,
  getEncoreLink,
} from '@weco/common/utils/works';
import {
  getIIIFPresentationLicenceInfo,
  getIIIFImageLicenceInfo,
  getIIIFPresentationCredit,
  getIIIFImageCredit,
} from '@weco/common/utils/iiif';
import NextLink from 'next/link';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import Icon from '@weco/common/views/components/Icon/Icon';
import CopyUrl from '@weco/common/views/components/CopyUrl/CopyUrl';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Space from '@weco/common/views/components/styled/Space';
import { clientSideSearchParams } from '@weco/common/services/catalogue/search-params';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import Download from '../Download/Download';
import WorkDetailsSection from '../WorkDetailsSection/WorkDetailsSection';
import WorkDetailsText from '../WorkDetailsText/WorkDetailsText';
import WorkDetailsList from '../WorkDetailsList/WorkDetailsList';
import WorkDetailsLinks from '../WorkDetailsLinks/WorkDetailsLinks';
import WorkDetailsTags from '../WorkDetailsTags/WorkDetailsTags';
import WorkItemsStatus from '../WorkItemsStatus/WorkItemsStatus';
import type { DigitalLocation } from '@weco/common/utils/works';

type Work = Object;

type Props = {|
  work: Work,
  iiifPresentationManifest: ?IIIFManifest,
  childManifestsCount?: number,
|};

const WorkDetails = ({
  work,
  iiifPresentationManifest,
  childManifestsCount,
}: Props) => {
  const duration =
    work.duration && moment.utc(work.duration).format('HH:mm:ss');
  const params = clientSideSearchParams();

  const iiifImageLocation = getLocationOfType(work, 'iiif-image');

  const digitalLocation: ?DigitalLocation =
    iiifImageLocation && iiifImageLocation.type === 'DigitalLocation'
      ? iiifImageLocation
      : null;

  const iiifImageLocationUrl = digitalLocation && digitalLocation.url;
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

  const iiifPresentationLocation = getIIIFPresentationLocation(work);

  const sierraIdFromPresentationManifestUrl =
    iiifPresentationLocation &&
    (iiifPresentationLocation.url.match(/iiif\/(.*)\/manifest/) || [])[1];

  const sierraWorkIds = getWorkIdentifiersWith(work, {
    identifierId: 'sierra-system-number',
  });

  const sierraWorkId = sierraWorkIds.length >= 1 ? sierraWorkIds[0] : null;

  // We do not wish to display a link to the old library site if the new site
  // provides a digital representation of that work
  const shouldDisplayEncoreLink = !(
    sierraIdFromPresentationManifestUrl === sierraWorkId
  );
  const encoreLink =
    shouldDisplayEncoreLink && sierraWorkId && getEncoreLink(sierraWorkId);

  const locationOfWork = work.notes.find(
    note => note.noteType.id === 'location-of-original'
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
          sierraIdFromPresentationManifestUrl &&
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
                        sierraId: sierraIdFromPresentationManifestUrl,
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
                linkAttributes: worksUrl({
                  ...params,
                  query: `"${contributor.agent.label}"`,
                  page: 1,
                }),
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

        {(locationOfWork || encoreLink) && (
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
                    <WorkItemsStatus work={work} />
                  </div>
                )
              }
            </TogglesContext.Consumer>
          </WorkDetailsSection>
        )}

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

        {licenseInfo && (
          <WorkDetailsSection headingText="License information">
            <div id="licenseInformation">
              {licenseInfo.humanReadableText.length > 0 && (
                <WorkDetailsText
                  title="License information"
                  text={licenseInfo.humanReadableText}
                />
              )}
              <WorkDetailsText
                title="Credit"
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
