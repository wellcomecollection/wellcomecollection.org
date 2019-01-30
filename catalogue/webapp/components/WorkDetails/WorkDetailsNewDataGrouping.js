// @flow
import type {LicenseData} from '@weco/common/utils/get-license-info';
import type {LicenseType} from '@weco/common/model/license';

import NextLink from 'next/link';
import {Fragment} from 'react';
import {font, spacing, grid, classNames} from '@weco/common/utils/classnames';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import {worksUrl} from '../../services/catalogue/urls';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Icon from '@weco/common/views/components/Icon/Icon';
import MoreLink from '@weco/common/views/components/Links/MoreLink/MoreLink';
import License from '@weco/common/views/components/License/License';
import Divider from '@weco/common/views/components/Divider/Divider';
import CopyUrl from '@weco/common/views/components/CopyUrl/CopyUrl';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import MetaUnit from '@weco/common/views/components/MetaUnit/MetaUnit';

type Work = Object;
type Props = {|
  work: Work,
  iiifImageLocationUrl: ?string,
  licenseInfo: ?LicenseData,
  iiifImageLocationCredit: ?string,
  iiifImageLocationLicenseId: ?LicenseType,
  encoreLink: ?string
|}

const WorkDetails = ({
  work,
  iiifImageLocationUrl,
  licenseInfo,
  iiifImageLocationCredit,
  iiifImageLocationLicenseId,
  encoreLink
}: Props) => {
  return (
    <div className={`row ${spacing({s: 6}, {padding: ['top', 'bottom']})}`}>
      <div className='container'>
        <div className='grid'>
          <div className={classNames([
            grid({s: 12, m: 12, l: 10, xl: 10}),
            spacing({s: 4}, {margin: ['bottom']})
          ])}>
            <SpacingComponent>
              <h1 id='work-info'
                className={classNames([
                  font({s: 'HNM3', m: 'HNM2', l: 'HNM1'}),
                  spacing({s: 0}, {margin: ['top']})
                ])}>{work.title}</h1>

              {work.contributors.length > 0 &&
                <MetaUnit headingText='' links={work.contributors.map(contributor => {
                  const linkAttributes = worksUrl({ query: `contributors:"${contributor.agent.label}"`, page: undefined });
                  return (<NextLink key={1} {...linkAttributes}>
                    <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{contributor.agent.label}</a>
                  </NextLink>);
                }
                )} />}

              {work.workType &&
                <MetaUnit headingText='' links={[
                  <NextLink key={1} {...worksUrl({ query: `workType:"${work.workType.label}"`, page: undefined })}>
                    <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{work.workType.label}</a>
                  </NextLink>
                ]} />
              }

              {work.genres.length > 0 &&
                <MetaUnit headingText='' links={work.genres.map(genre => {
                  const linkAttributes = worksUrl({ query: `genres:"${genre.label}"`, page: undefined });
                  return (<NextLink key={1} {...linkAttributes}>
                    <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{genre.label}</a>
                  </NextLink>);
                }
                )} />
              }

              {work.production.length > 0 &&
                work.production.map((production, i) => {
                  return (
                    production.dates.length > 0 &&
                    <MetaUnit headingLevel={2} headingText='Dates' text={production.dates.map(date => date.label)} />
                  );
                })
              }
            </SpacingComponent>

            <SpacingComponent>
              <Divider extraClasses={`divider--pumice divider--keyline ${spacing({s: 1}, {margin: ['top', 'bottom']})}`} />
              <h2 className={classNames([
                font({s: 'HNM4', m: 'HNM3', l: 'HNM2'}),
                spacing({s: 0}, {margin: ['top']})
              ])}>Summary</h2>
              {work.description &&
                <MetaUnit headingText='Description' text={[work.description]} />
              }
              {work.lettering &&
                <MetaUnit headingText='Lettering' text={[work.lettering]} />
              }
            </SpacingComponent>

            <SpacingComponent>
              <Divider extraClasses={`divider--pumice divider--keyline ${spacing({s: 1}, {margin: ['top', 'bottom']})}`} />
              <h2 className={classNames([
                font({s: 'HNM4', m: 'HNM3', l: 'HNM2'}),
                spacing({s: 0}, {margin: ['top']})
              ])}>How it looks</h2>
              {(work.physicalDescription || work.extent || work.dimensions) &&
                <MetaUnit headingText='Physical description' text={[[work.extent, work.physicalDescription, work.dimensions].filter(Boolean).join(' ')]} />
              }
            </SpacingComponent>

            <SpacingComponent>
              <Divider extraClasses={`divider--pumice divider--keyline ${spacing({s: 1}, {margin: ['top', 'bottom']})}`} />
              <h2 className={classNames([
                font({s: 'HNM4', m: 'HNM3', l: 'HNM2'}),
                spacing({s: 0}, {margin: ['top']})
              ])}>How it&apos;s created</h2>

              {work.contributors.length > 0 &&
                <MetaUnit headingText='Contributors' links={work.contributors.map(contributor => {
                  const linkAttributes = worksUrl({ query: `contributors:"${contributor.agent.label}"`, page: undefined });
                  return (<NextLink key={1} {...linkAttributes}>
                    <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{contributor.agent.label}</a>
                  </NextLink>);
                }
                )} />}

              {work.production.length > 0 &&
                <Fragment>
                  <h2 className={`${font({s: 'HNM5', m: 'HNM4'})} ${spacing({s: 0}, {margin: ['top']})} ${spacing({s: 2}, {margin: ['bottom']})}`}>
                  Production
                  </h2>
                  {work.production.map((production, i) => {
                    return (
                      <Fragment key={i}>
                        {production.places.length > 0 &&
                        <MetaUnit headingLevel={3} headingText='Places' list={production.places.map(place => place.label)} />}
                        {production.agents.length > 0 &&
                        <MetaUnit headingLevel={3} headingText='Agents' list={production.agents.map(agent => agent.label)} />}
                        {production.dates.length > 0 &&
                        <MetaUnit headingLevel={3} headingText='Dates' list={production.dates.map(date => date.label)} />}
                      </Fragment>
                    );
                  })}
                </Fragment>
              }

              {work.language &&
                <MetaUnit headingText='Language' links={[
                  <NextLink key={1} {...worksUrl({ query: `language:"${work.language.label}"`, page: undefined })}>
                    <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{work.language.label}</a>
                  </NextLink>
                ]} />
              }
            </SpacingComponent>

            <SpacingComponent>
              <Divider extraClasses={`divider--pumice divider--keyline ${spacing({s: 1}, {margin: ['top', 'bottom']})}`} />
              <h2 className={classNames([
                font({s: 'HNM4', m: 'HNM3', l: 'HNM2'}),
                spacing({s: 0}, {margin: ['top']})
              ])}>Part of</h2>
              {work.subjects.length > 0 &&
                <MetaUnit headingText='Subjects' links={work.subjects.map(subject => {
                  const linkAttributes = worksUrl({ query: `subjects:"${subject.label}"`, page: undefined });
                  return (<NextLink key={1} {...linkAttributes}>
                    <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{subject.label}</a>
                  </NextLink>);
                }
                )} />
              }
              {work.genres.length > 0 &&
                  <MetaUnit headingText='Genres' links={work.genres.map(genre => {
                    const linkAttributes = worksUrl({ query: `genres:"${genre.label}"`, page: undefined });
                    return (<NextLink key={1} {...linkAttributes}>
                      <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{genre.label}</a>
                    </NextLink>);
                  }
                  )} />
              }
            </SpacingComponent>

            <SpacingComponent>
              <Divider extraClasses={`divider--pumice divider--keyline ${spacing({s: 1}, {margin: ['top', 'bottom']})}`} />
              <h2 className={classNames([
                font({s: 'HNM4', m: 'HNM3', l: 'HNM2'}),
                spacing({s: 0}, {margin: ['top']})
              ])}>How do I reference?</h2>
            </SpacingComponent>

            {iiifImageLocationUrl &&
              <SpacingComponent>
                <div className={spacing({s: 2}, {margin: ['bottom']})}>
                  <Button
                    type='tertiary'
                    url={convertImageUri(iiifImageLocationUrl, 'full')}
                    target='_blank'
                    download={`${work.id}.jpg`}
                    rel='noopener noreferrer'
                    trackingEvent={{
                      category: 'Button',
                      action: 'download large work image',
                      label: work.id
                    }}
                    icon='download'
                    text='Download full size' />
                </div>
                <div className={spacing({s: 3}, {margin: ['bottom']})}>
                  <Button
                    type='tertiary'
                    url={convertImageUri(iiifImageLocationUrl, 760)}
                    target='_blank'
                    download={`${work.id}.jpg`}
                    rel='noopener noreferrer'
                    trackingEvent={{
                      category: 'Button',
                      action: 'download small work image',
                      label: work.id
                    }}
                    icon='download'
                    text='Download small (760px)' />
                </div>

                {(iiifImageLocationCredit || iiifImageLocationLicenseId) &&
                  <div className={spacing({s: 4}, {margin: ['bottom']})}>
                    {iiifImageLocationCredit && <p className={classNames([
                      font({s: 'HNL5', m: 'HNL4'}),
                      spacing({s: 1}, {margin: ['bottom']})
                    ])}>Credit: {iiifImageLocationCredit}</p>}
                    {iiifImageLocationLicenseId && <License subject={''} licenseType={iiifImageLocationLicenseId} /> }
                  </div>
                }
              </SpacingComponent>

            }

            {/* old stuff without a home below here
            <SpacingComponent>
              <Divider extraClasses={`divider--pumice divider--keyline ${spacing({s: 1}, {margin: ['top', 'bottom']})}`} />
              <h2 className={classNames([
                font({s: 'HNM4', m: 'HNM3'})
              ])}>Item details</h2>
            </SpacingComponent>

            <SpacingComponent>
              {work.createdDate &&
                <MetaUnit headingText='Created date' text={[work.createdDate.label]} />
              }
            </SpacingComponent>
            */}

            {encoreLink &&
              <SpacingComponent>
                <MoreLink name='View Wellcome Library catalogue record' url={encoreLink} />
              </SpacingComponent>
            }

            {licenseInfo &&
              <Fragment>
                <SpacingComponent>
                  <Divider extraClasses={`divider--pumice divider--keyline ${spacing({s: 1}, {margin: ['top', 'bottom']})}`} />
                  <h2 className={classNames([
                    font({s: 'HNM4', m: 'HNM3'})
                  ])}>Using this image</h2>
                </SpacingComponent>
                <SpacingComponent>
                  <MetaUnit headingLevel={3} headingText='License information' text={licenseInfo.humanReadableText} />
                  <MetaUnit headingLevel={3} headingText='Credit' text={[
                    `${work.title}.{' '}
                    ${iiifImageLocationCredit ? `Credit: <a href="https://wellcomecollection.org/works/${work.id}">${iiifImageLocationCredit}</a>. ` : ` `}
                    ${licenseInfo.url ? `<a href="${licenseInfo.url}">${licenseInfo.text}</a>` : licenseInfo.text}`]} />
                </SpacingComponent>
              </Fragment>
            }

            <SpacingComponent>
              <Divider extraClasses={`divider--pumice divider--keyline ${spacing({s: 1}, {margin: ['top', 'bottom']})}`} />
              <h2 className={classNames([
                font({s: 'HNM4', m: 'HNM3'})
              ])}>Share</h2>
            </SpacingComponent>

            <SpacingComponent>
              <CopyUrl id={work.id} url={`https://wellcomecollection.org/works/${work.id}`} />
            </SpacingComponent>

            <SpacingComponent>
              <div className={classNames([
                spacing({s: 2}, {padding: ['top', 'bottom']}),
                spacing({s: 4}, {padding: ['left', 'right']}),
                spacing({s: 4}, {margin: ['top', 'bottom']}),
                'bg-cream rounded-diagonal flex flex--v-center'
              ])}>
                <Icon name='underConstruction' extraClasses='margin-right-s2' />
                <p className={`${font({s: 'HNL5', m: 'HNL4'})} no-margin`}>
                    We’re improving the information on this page. <a href='/works/progress'>Find out more</a>.
                </p>
              </div>
            </SpacingComponent>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetails;
