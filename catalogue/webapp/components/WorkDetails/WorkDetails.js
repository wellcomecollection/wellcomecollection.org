// @flow
import type { Node } from 'react';
import type { LicenseData } from '@weco/common/utils/get-license-info';
import type { LicenseType } from '@weco/common/model/license';

import NextLink from 'next/link';
import styled from 'styled-components';
import { font, spacing, grid, classNames } from '@weco/common/utils/classnames';
import { worksUrl } from '../../services/catalogue/urls';
import { Fragment } from 'react';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Icon from '@weco/common/views/components/Icon/Icon';
import Divider from '@weco/common/views/components/Divider/Divider';
import CopyUrl from '@weco/common/views/components/CopyUrl/CopyUrl';
import MetaUnit from '@weco/common/views/components/MetaUnit/MetaUnit2';
import Download from '../Download/Download';
import DownloadBeta from '../Download/DownloadBeta';

const StyledWorkDetailsSection = styled.div`
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

type WorkDetailsSectionProps = {|
  headingText?: string,
  children: Node,
|};

const WorkDetailsSection = ({
  headingText,
  children,
}: WorkDetailsSectionProps) => {
  return (
    <StyledWorkDetailsSection>
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
    </StyledWorkDetailsSection>
  );
};

type Work = Object;

type Props = {|
  work: Work,
  iiifImageLocationUrl: ?string,
  licenseInfo: ?LicenseData,
  iiifImageLocationCredit: ?string,
  iiifImageLocationLicenseId: ?LicenseType,
  encoreLink: ?string,
|};

const WorkDetails = ({
  work,
  iiifImageLocationUrl,
  licenseInfo,
  iiifImageLocationCredit,
  iiifImageLocationLicenseId,
  encoreLink,
}: Props) => {
  const singularWorkTypeLabel = work.workType.label
    ? work.workType.label.replace(/s$/g, '').toLowerCase()
    : 'item';
  const isbnIdentifiers = work.identifiers.filter(id => {
    return id.identifierType.id === 'isbn';
  });

  const WorkDetailsSections = [];

  if (iiifImageLocationUrl) {
    WorkDetailsSections.push(
      <WorkDetailsSection>
        <Download
          work={work}
          iiifImageLocationUrl={iiifImageLocationUrl}
          licenseInfo={licenseInfo}
          iiifImageLocationCredit={iiifImageLocationCredit}
          iiifImageLocationLicenseId={iiifImageLocationLicenseId}
        />
      </WorkDetailsSection>
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
      </WorkDetailsSection>
    );
  }
  if (encoreLink) {
    WorkDetailsSections.push(
      <WorkDetailsSection headingText="Find in the library">
        <div className="spaced-text">
          <p>
            {`This ${singularWorkTypeLabel} is available at `}
            <a href={encoreLink}>Wellcome Library</a>
          </p>
        </div>
      </WorkDetailsSection>
    );
  }
  WorkDetailsSections.push(
    <WorkDetailsSection headingText="Identifiers">
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
    </WorkDetailsSection>
  );
  if (licenseInfo) {
    WorkDetailsSections.push(
      <WorkDetailsSection headingText="License information">
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
        'bg-cream': true,
        [spacing({ s: 6, m: 8 }, { padding: ['top', 'bottom'] })]: true,
      })}
    >
      <div className="container">
        <div className="grid">
          <div className={classNames([grid({ s: 12, m: 12, l: 10, xl: 10 })])}>
            <SpacingComponent>
              <DownloadBeta
                work={work}
                iiifImageLocationUrl={iiifImageLocationUrl}
                licenseInfo={licenseInfo}
                iiifImageLocationCredit={iiifImageLocationCredit}
                iiifImageLocationLicenseId={iiifImageLocationLicenseId}
              />
            </SpacingComponent>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetails;
