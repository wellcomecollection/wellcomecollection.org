// @flow
import { type Node, Fragment } from 'react';
import getLicenseInfo, {
  type LicenseData,
} from '@weco/common/utils/get-license-info';
import { type LicenseType } from '@weco/common/model/license';
import { type IIIFRendering, type IIIFManifest } from '@weco/common/model/iiif';
import { font, spacing, grid, classNames } from '@weco/common/utils/classnames';
import { worksUrl } from '@weco/common/services/catalogue/urls';
import {
  getDownloadOptionsFromManifest,
  getIIIFMetadata,
} from '@weco/common/utils/works';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import Icon from '@weco/common/views/components/Icon/Icon';
import Divider from '@weco/common/views/components/Divider/Divider';
import CopyUrl from '@weco/common/views/components/CopyUrl/CopyUrl';
import MetaUnit from '@weco/common/views/components/MetaUnit/MetaUnit';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import Download from '../Download/Download';

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
              [font({ s: 'WB6', m: 'WB5' })]: true,
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
  iiifPresentationManifest: ?IIIFManifest,
  licenseInfo: ?LicenseData,
  iiifImageLocationCredit: ?string,
  iiifImageLocationLicenseId: ?LicenseType,
  downloadOptions: IIIFRendering[],
  encoreLink: ?string,
|};

const WorkDetails = ({
  work,
  iiifPresentationManifest,
  licenseInfo,
  iiifImageLocationCredit,
  iiifImageLocationLicenseId,
  downloadOptions,
  encoreLink,
}: Props) => {
  const singularWorkTypeLabel = work.workType.label
    ? work.workType.label.replace(/s$/g, '').toLowerCase()
    : 'item';

  const isbnIdentifiers = work.identifiers.filter(id => {
    return id.identifierType.id === 'isbn';
  });

  const WorkDetailsSections = [];

  const iiifPresentationDownloadOptions = iiifPresentationManifest
    ? getDownloadOptionsFromManifest(iiifPresentationManifest)
    : [];

  const allDownloadOptions = [
    ...downloadOptions,
    ...iiifPresentationDownloadOptions,
  ];

  const iiifPresentationLicenseInfo =
    iiifPresentationManifest && iiifPresentationManifest.license
      ? getLicenseInfo(iiifPresentationManifest.license)
      : '';

  const definitiveLicenseInfo =
    licenseInfo || (iiifPresentationLicenseInfo || null);

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
            licenseInfo={definitiveLicenseInfo}
            iiifImageLocationLicenseId={iiifImageLocationLicenseId}
            iiifImageLocationCredit={iiifImageLocationCredit}
            downloadOptions={allDownloadOptions}
          />
        </div>
      </div>
    );
  }
  if (
    work.description ||
    work.production.length > 0 ||
    work.physicalDescription ||
    work.extent ||
    work.dimensions ||
    work.lettering ||
    work.genres.length > 0 ||
    work.language
  ) {
    WorkDetailsSections.push(
      <WorkDetailsSection headingText={`About this ${singularWorkTypeLabel}`}>
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
                query: `"${contributor.agent.label}"`,
                page: 1,
              }),
            }))}
          />
        )}

        {work.production.length > 0 && (
          <MetaUnit
            headingLevel={3}
            headingText="Publication/Creation"
            text={work.production.map(productionEvent => productionEvent.label)}
          />
        )}

        {(work.physicalDescription || work.extent || work.dimensions) && (
          <MetaUnit
            headingLevel={3}
            headingText="Physical description"
            text={[
              [work.extent, work.physicalDescription, work.dimensions]
                .filter(Boolean)
                .join(' '),
            ]}
          />
        )}

        {work.lettering && (
          <MetaUnit
            headingLevel={3}
            headingText="Lettering"
            text={[work.lettering]}
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
                query: `"${s.label}"`,
                page: 1,
              }),
            };
          })}
        />
      </WorkDetailsSection>
    );
  }
  if (encoreLink || iiifPresentationRepository) {
    const textArray = [
      encoreLink && `<a href="${encoreLink}">Wellcome library</a>`,
      iiifPresentationRepository &&
        iiifPresentationRepository.value
          .replace(/<img[^>]*>/g, '')
          .replace(/<br\s*\/?>/g, ''),
    ].filter(Boolean);
    WorkDetailsSections.push(
      <WorkDetailsSection headingText="Where to find it">
        <MetaUnit text={textArray} />
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
    </WorkDetailsSection>
  );
  if (definitiveLicenseInfo) {
    WorkDetailsSections.push(
      <WorkDetailsSection headingText="License information">
        <div id="licenseInformation">
          <MetaUnit
            headingLevel={3}
            headingText="License information"
            text={definitiveLicenseInfo.humanReadableText}
          />
          <MetaUnit
            headingLevel={3}
            headingText="Credit"
            text={[
              `${work.title.replace(/\.$/g, '')}.${' '}
              ${
                iiifImageLocationCredit
                  ? `Credit: <a href="https://wellcomecollection.org/works/${
                      work.id
                    }">${iiifImageLocationCredit}</a>. `
                  : ` `
              }
              ${
                definitiveLicenseInfo.url
                  ? `<a href="${definitiveLicenseInfo.url}">${
                      definitiveLicenseInfo.text
                    }</a>`
                  : definitiveLicenseInfo.text
              }`,
            ]}
          />
        </div>
      </WorkDetailsSection>
    );
  }
  WorkDetailsSections.push(
    <WorkDetailsSection>
      <div className="flex flex--v-center">
        <Icon name="underConstruction" extraClasses="margin-right-s2" />
        <p
          className={`${font({
            s: 'HNL5',
            m: 'HNL4',
          })} no-margin`}
        >
          We’re improving the information on this page.{' '}
          <a href="/works/progress">Find out more</a>.
        </p>
      </div>
    </WorkDetailsSection>
  );

  return (
    <div
      className={classNames({
        row: true,
        [spacing({ s: 6, m: 8 }, { padding: ['top', 'bottom'] })]: true,
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
    </div>
  );
};

export default WorkDetails;
