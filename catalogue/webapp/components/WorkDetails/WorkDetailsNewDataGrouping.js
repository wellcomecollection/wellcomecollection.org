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
import IIIFPresentationDisplay from '@weco/common/views/components/IIIFPresentationDisplay/IIIFPresentationDisplay';

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
  const [iiifPresentationLocation] = work.items.map(
    item => item.locations.find(
      location => location.locationType.id === 'iiif-presentation'
    )
  ).filter(Boolean);
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

              {iiifPresentationLocation &&
                  <IIIFPresentationDisplay
                    physicalDescription={[work.extent].filter(Boolean).join(' ')}
                    manifestLocation={iiifPresentationLocation.url} />
              }

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
              ])}>{`About this ${work.workType.label ? work.workType.label.substring(0, work.workType.label.length - 1).toLowerCase() : item}`}</h2>
              {work.description &&
                <MetaUnit headingText='Description' text={[work.description]} />
              }

              {work.production[0] && work.production[0].label &&  <MetaUnit headingText='Publication/Creation' text={[work.production[0].label]} />}

              {(work.physicalDescription || work.extent || work.dimensions) &&
                <MetaUnit headingText='Physical description' text={[[work.extent, work.physicalDescription, work.dimensions].filter(Boolean).join(' ')]} />}

              {work.lettering &&
                  <MetaUnit headingText='Lettering' text={[work.lettering]} />
              }

              {work.genres.length > 0 &&
                <MetaUnit headingText='Type' links={work.genres.map(genre => {
                  const linkAttributes = worksUrl({ query: `genres:"${genre.label}"`, page: undefined });
                  return (<NextLink key={1} {...linkAttributes}>
                    <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{genre.label}</a>
                  </NextLink>);
                }
                )} />
              }

              {work.language &&
                <MetaUnit headingText='Language' links={[
                  <NextLink key={1} {...worksUrl({ query: `language:"${work.language.label}"`, page: undefined })}>
                    <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{work.language.label}</a>
                  </NextLink>
                ]} />
              }

              {work.contributors.length > 0 &&
                <MetaUnit headingText='Contributors' links={work.contributors.map(contributor => {
                  const linkAttributes = worksUrl({ query: `contributors:"${contributor.agent.label}"`, page: undefined });
                  return (<NextLink key={1} {...linkAttributes}>
                    <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{contributor.agent.label}</a>
                  </NextLink>);
                }
                )} />}
            </SpacingComponent>

            <SpacingComponent>
              <Divider extraClasses={`divider--pumice divider--keyline ${spacing({s: 1}, {margin: ['top', 'bottom']})}`} />
              <h2 className={classNames([
                font({s: 'HNM4', m: 'HNM3', l: 'HNM2'}),
                spacing({s: 0}, {margin: ['top']})
              ])}>Subjects</h2>
              {work.subjects.length > 0 &&
                <MetaUnit headingText='' links={work.subjects.map(subject => {
                  const linkAttributes = worksUrl({ query: `subjects:"${subject.label}"`, page: undefined });
                  return (<NextLink key={1} {...linkAttributes}>
                    <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{subject.label}</a>
                  </NextLink>);
                }
                )} />
              }

            </SpacingComponent>
            {encoreLink &&
            <SpacingComponent>
              <Divider extraClasses={`divider--pumice divider--keyline ${spacing({s: 1}, {margin: ['top', 'bottom']})}`} />
              <h2 className={classNames([
                font({s: 'HNM4', m: 'HNM3', l: 'HNM2'}),
                spacing({s: 0}, {margin: ['top']})
              ])}>Find in the library</h2>
              {work.identifiers.length > 0 && work.identifiers.filter((id) => {
                return id.identifierType.id === 'isbn';
              }).map(id => {
                return <MetaUnit key={id.value} headingText='ISBN' text={[id.value]} />;
              })}

              <MoreLink name='View Wellcome Library catalogue record' url={encoreLink} />
            </SpacingComponent>
            }
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
