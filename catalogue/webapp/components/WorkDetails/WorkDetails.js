// @flow
import type { Node } from 'react';
import type { LicenseData } from '@weco/common/utils/get-license-info';
import type { LicenseType } from '@weco/common/model/license';
import NextLink from 'next/link';
import styled from 'styled-components';
import { font, spacing, classNames } from '@weco/common/utils/classnames';
import { worksUrl } from '../../services/catalogue/urls';
import { Fragment } from 'react';
import {
  iiifImageTemplate,
  convertImageUri,
  convertIiifUriToInfoUri,
} from '@weco/common/utils/convert-image-uri';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Icon from '@weco/common/views/components/Icon/Icon';
import Divider from '@weco/common/views/components/Divider/Divider';
import CopyUrl from '@weco/common/views/components/CopyUrl/CopyUrl';
import MetaUnit from '@weco/common/views/components/MetaUnit/MetaUnit';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import Download from '../Download/Download';
import DownloadBeta from '../Download/DownloadBeta';
import IIIFPresentationPreview from '@weco/common/views/components/IIIFPresentationPreview/IIIFPresentationPreview';
// import IIIFImagePreview, which include ImageViewer - no js links to big image
import ImageViewer from '@weco/common/views/components/ImageViewer/ImageViewer2';

type WorkDetailsSectionProps = {|
  className?: string,
  headingText?: string,
  children: Node,
|};

const WorkDetailsSection = ({
  className,
  headingText,
  children,
}: WorkDetailsSectionProps) => {
  return (
    <div className={className}>
      {headingText ? (
        <h2
          className={classNames({
            [font({ s: 'WB6', m: 'WB5' })]: true,
            'work-details-heading': true,
          })}
        >
          {headingText}
        </h2>
      ) : (
        <div className="work-details-heading" />
      )}

      <div className="work-details-body">{children}</div>
    </div>
  );
};

const StyledWorkDetailsSection = styled(WorkDetailsSection)`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  padding: 0;

  &:first-child {
    border-top: 0;
  }

  .work-details-heading,
  .work-details-body {
    grid-column: 1 / -1;
  }

  h3 + * {
    margin: 0;
  }

  h2.work-details-heading {
    margin: ${props => `0 0 ${props.theme.spacingUnit * 2}px 0`};
  }

  ${props => props.theme.media.large`
    h2.work-details-heading {
      margin: 0;
    }

    .work-details-heading {
      grid-column: span 4;
    }

    .work-details-body {
      grid-column: span 6;
    }
  `}
`;

type Work = Object;

type Props = {|
  work: Work,
  iiifImageLocationUrl: ?string,
  licenseInfo: ?LicenseData,
  iiifImageLocationCredit: ?string,
  iiifImageLocationLicenseId: ?LicenseType,
  encoreLink: ?string,
  useBetaDownloadComponent: boolean,
  showSingleImageWorkPreview: boolean,
|};

const WorkDetails = ({
  work,
  iiifImageLocationUrl,
  licenseInfo,
  iiifImageLocationCredit,
  iiifImageLocationLicenseId,
  encoreLink,
  useBetaDownloadComponent,
  showSingleImageWorkPreview,
}: Props) => {
  const singularWorkTypeLabel = work.workType.label
    ? work.workType.label.replace(/s$/g, '').toLowerCase()
    : 'item';
  const isbnIdentifiers = work.identifiers.filter(id => {
    return id.identifierType.id === 'isbn';
  });

  const [iiifPresentationLocation] = work.items
    .map(item =>
      item.locations.find(
        location => location.locationType.id === 'iiif-presentation'
      )
    )
    .filter(Boolean);

  const WorkDetailsSections = [];
  if (iiifImageLocationUrl || iiifPresentationLocation) {
    WorkDetailsSections.push(
      <StyledWorkDetailsSection
        headingText={`What this ${singularWorkTypeLabel} looks like`}
      >
        {iiifPresentationLocation && (
          <IIIFPresentationPreview
            manifestLocation={iiifPresentationLocation.url}
          />
        )}
        {iiifImageLocationUrl && (
          <Fragment>
            <ImageViewer
              infoUrl={convertIiifUriToInfoUri(
                convertImageUri(
                  iiifImageTemplate(iiifImageLocationUrl)({
                    size: '800,',
                  }),
                  'full',
                  false
                )
              )}
              contentUrl={iiifImageTemplate(iiifImageLocationUrl)({
                size: ',400',
              })}
              id={iiifImageLocationUrl}
            />
          </Fragment>
        )}
      </StyledWorkDetailsSection>
    );
  }
  if (iiifImageLocationUrl) {
    if (useBetaDownloadComponent) {
      WorkDetailsSections.push(
        <SpacingComponent>
          <DownloadBeta
            work={work}
            iiifImageLocationUrl={iiifImageLocationUrl}
            licenseInfo={licenseInfo}
            iiifImageLocationCredit={iiifImageLocationCredit}
            iiifImageLocationLicenseId={iiifImageLocationLicenseId}
          />
        </SpacingComponent>
      );
    } else {
      WorkDetailsSections.push(
        <StyledWorkDetailsSection>
          <Download
            work={work}
            iiifImageLocationUrl={iiifImageLocationUrl}
            licenseInfo={licenseInfo}
            iiifImageLocationCredit={iiifImageLocationCredit}
            iiifImageLocationLicenseId={iiifImageLocationLicenseId}
          />
        </StyledWorkDetailsSection>
      );
    }
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
      <StyledWorkDetailsSection
        headingText={`About this ${singularWorkTypeLabel}`}
      >
        <div className="spaced-text">
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
              text={[
                work.contributors
                  .map(contributor => contributor.agent.label)
                  .join(' | '),
              ]}
            />
          )}

          {work.production.length > 0 && (
            <MetaUnit
              headingLevel={3}
              headingText="Publication/Creation"
              text={work.production.map(
                productionEvent => productionEvent.label
              )}
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
              headingText="Type"
              links={work.genres.map(genre => {
                const linkAttributes = worksUrl({
                  query: `"${genre.label}"`,
                  page: 1,
                });
                return (
                  <NextLink key={1} {...linkAttributes}>
                    {genre.label}
                  </NextLink>
                );
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
        </div>
      </StyledWorkDetailsSection>
    );
  }
  if (work.subjects.length > 0) {
    WorkDetailsSections.push(
      <StyledWorkDetailsSection headingText="Subjects">
        <MetaUnit
          headingText=""
          links={work.subjects.map(subject => {
            const linkAttributes = worksUrl({
              query: `"${subject.label}"`,
              page: 1,
            });
            return (
              <NextLink key={1} {...linkAttributes}>
                {subject.label}
              </NextLink>
            );
          })}
        />
      </StyledWorkDetailsSection>
    );
  }
  if (encoreLink) {
    WorkDetailsSections.push(
      <StyledWorkDetailsSection headingText="Find in the library">
        <div className="spaced-text">
          <p>
            {`This ${singularWorkTypeLabel} is available at `}
            <a href={encoreLink}>Wellcome Library</a>
          </p>
        </div>
      </StyledWorkDetailsSection>
    );
  }
  WorkDetailsSections.push(
    <StyledWorkDetailsSection headingText="Identifiers">
      {isbnIdentifiers.length > 0 && (
        <div className="spaced-text" style={{ marginBottom: '1.6em' }}>
          <MetaUnit
            headingText="ISBN"
            list={isbnIdentifiers.map(id => id.value)}
          />
        </div>
      )}
      <MetaUnit headingText="Share">
        <CopyUrl
          id={work.id}
          url={`https://wellcomecollection.org/works/${work.id}`}
        />
      </MetaUnit>
    </StyledWorkDetailsSection>
  );
  if (licenseInfo) {
    WorkDetailsSections.push(
      <StyledWorkDetailsSection headingText="License information">
        <div className="spaced-text" id="licenseInformation">
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
    iiifImageLocationCredit
      ? `Credit: <a href="https://wellcomecollection.org/works/${
          work.id
        }">${iiifImageLocationCredit}</a>. `
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
      </StyledWorkDetailsSection>
    );
  }
  WorkDetailsSections.push(
    <StyledWorkDetailsSection>
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
    </StyledWorkDetailsSection>
  );

  return (
    <div
      className={classNames({
        row: true,
        'bg-cream': true,
        [spacing({ s: 6, m: 8 }, { padding: ['top', 'bottom'] })]: true,
      })}
    >
      <div className="container">
        <div className="grid">
          <Layout12>
            {WorkDetailsSections.map((section, i) => {
              return (
                <Fragment key={i}>
                  {i > 0 && (
                    <SpacingComponent>
                      <Divider extraClasses="divider--pumice divider--keyline" />
                    </SpacingComponent>
                  )}

                  <SpacingComponent>{section}</SpacingComponent>
                </Fragment>
              );
            })}
          </Layout12>
        </div>
      </div>
    </div>
  );
};

export default WorkDetails;
