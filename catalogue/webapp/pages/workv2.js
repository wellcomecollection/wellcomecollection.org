// @flow
import {Fragment} from 'react';
import ReactGA from 'react-ga';
import NextLink from 'next/link';
import {font, spacing, grid, classNames} from '@weco/common/utils/classnames';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import Icon from '@weco/common/views/components/Icon/Icon';
import PrimaryLink from '@weco/common/views/components/Links/PrimaryLink/PrimaryLink';
import License from '@weco/common/views/components/License/License';
import Divider from '@weco/common/views/components/Divider/Divider';
import CopyUrl from '@weco/common/views/components/CopyUrl/CopyUrl';
import SecondaryLink from '@weco/common/views/components/Links/SecondaryLink/SecondaryLink';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import MetaUnit from '@weco/common/views/components/MetaUnit/MetaUnit';
import {workLd} from '@weco/common/utils/json-ld';
import WorkMedia from '@weco/common/views/components/WorkMedia/WorkMedia';
import {getWork} from '../services/catalogue/worksv2';
import {worksV2Link} from '../services/catalogue/links';
import getLicenseInfo from '@weco/common/utils/get-license-info';
import WorkRedesign from '../components/WorkRedesign/WorkRedesign';

export type Link = {|
  text: string;
  url: string;
|};

// Not sure we want to type this not dynamically
// as the API is subject to change?
type Work = Object;
type Props = {|
  work: Work,
  previousQueryString: ?string,
  page: ?number,
  showRedesign: boolean
|}

export const WorkPage = ({
  work,
  previousQueryString,
  showRedesign
}: Props) => {
  const [iiifImageLocation] = work.items.map(
    item => item.locations.find(
      location => location.locationType.id === 'iiif-image'
    )
  ).filter(Boolean);
  const iiifImageLocationUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImageLocationCredit = iiifImageLocation && iiifImageLocation.credit;
  const iiifImageLocationLicenseId = iiifImageLocation && iiifImageLocation.license && iiifImageLocation.license.id;
  const licenseInfo = iiifImageLocationLicenseId && getLicenseInfo(iiifImageLocationLicenseId);

  const sierraId = (work.identifiers.find(identifier =>
    identifier.identifierType.id === 'sierra-system-number'
  ) || {}).value;
  // We strip the last character as that's what Wellcome Library expect
  const encoreLink = sierraId && `http://search.wellcomelibrary.org/iii/encore/record/C__R${sierraId.substr(0, sierraId.length - 1)}`;

  if (showRedesign) {
    return (
      <WorkRedesign
        work={work}
        iiifImageLocationUrl={iiifImageLocationUrl}
        encoreLink={encoreLink}
        licenseInfo={licenseInfo}
        iiifImageLocationCredit={iiifImageLocationCredit}
        iiifImageLocationLicenseId={iiifImageLocationLicenseId} />
    );
  }

  return (
    <PageLayout
      title={work.title}
      description={work.description || work.title}
      url={{pathname: `/works/${work.id}`}}
      openGraphType={'website'}
      jsonLd={workLd(work)}
      oEmbedUrl={`https://wellcomecollection.org/oembed/works/${work.id}`}
      imageUrl={iiifImageLocationUrl}
      imageAltText={work.title}>
      <InfoBanner text={`Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`} cookieName='WC_wellcomeImagesRedirect' />

      {previousQueryString &&
        <div className='row'>
          <div className='container'>
            <div className='grid'>
              <div className={grid({s: 12})}>
                <SecondaryLink
                  url={`/works${previousQueryString || ''}#${work.id}`}
                  text='Search results'
                  trackingEvent={{
                    category: 'component',
                    action: 'return-to-results:click',
                    label: `id:${work.id}, query:${previousQueryString || ''}, title:${work.title}`
                  }} />
              </div>
            </div>
          </div>
        </div>
      }

      <Fragment>
        {iiifImageLocationUrl && <WorkMedia
          id={work.id}
          iiifUrl={iiifImageLocationUrl}
          title={work.title} />}

        <div className={`row ${spacing({s: 6}, {padding: ['top', 'bottom']})}`}>
          <div className='container'>
            <div className='grid'>
              <div className={classNames([
                grid({s: 12, m: 10, shiftM: 1, l: 7, xl: 7}),
                spacing({s: 4}, {margin: ['bottom']})
              ])}>
                <div className={spacing({s: 5}, {margin: ['bottom']})}>
                  <h1 id='work-info'
                    className={classNames([
                      font({s: 'HNM3', m: 'HNM2', l: 'HNM1'}),
                      spacing({s: 0}, {margin: ['top']})
                    ])}>{work.title}</h1>

                  <div className={classNames([
                    spacing({s: 2}, {padding: ['top', 'bottom']}),
                    spacing({s: 4}, {padding: ['left', 'right']}),
                    spacing({s: 4}, {margin: ['bottom']}),
                    'bg-cream rounded-diagonal flex flex--v-center'
                  ])}>
                    <Icon name='underConstruction' extraClasses='margin-right-s2' />
                    <p className={`${font({s: 'HNL5', m: 'HNL4'})} no-margin`}>
                      We’re improving the information on this page. <a href='/works/progress'>Find out more</a>.
                    </p>
                  </div>

                  {work.description &&
                    <MetaUnit headingText='Description' text={[work.description]} />
                  }

                  {work.physicalDescription &&
                    <MetaUnit headingText='Physical description' text={[`${work.physicalDescription} ${work.extent} ${work.dimensions}`]} />
                  }

                  {work.workType &&
                    <MetaUnit headingText='Work type' links={[
                      <NextLink key={1} {...worksV2Link({ query: `workType:"${work.workType.label}"`, page: undefined })}>
                        <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{work.workType.label}</a>
                      </NextLink>
                    ]} />
                  }

                  {work.lettering &&
                    <MetaUnit headingText='Lettering' text={[work.lettering]} />
                  }

                  {work.createdDate &&
                    <MetaUnit headingText='Created date' text={[work.createdDate.label]} />
                  }

                  {work.contributors.length > 0 &&
                    <MetaUnit headingText='Contributors' links={work.contributors.map(contributor => {
                      const linkAttributes = worksV2Link({ query: `contributors:"${contributor.agent.label}"`, page: undefined });
                      return (<NextLink key={1} href={linkAttributes.href} as={linkAttributes.as}>
                        <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{contributor.agent.label}</a>
                      </NextLink>);
                    }
                    )} />

                  }

                  {work.subjects.length > 0 &&
                    <MetaUnit headingText='Subjects' links={work.subjects.map(subject => {
                      const linkAttributes = worksV2Link({ query: `subjects:"${subject.label}"`, page: undefined });
                      return (<NextLink key={1} href={linkAttributes.href} as={linkAttributes.as}>
                        <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{subject.label}</a>
                      </NextLink>);
                    }
                    )} />
                  }

                  {work.genres.length > 0 &&
                    <MetaUnit headingText='Genres' links={work.genres.map(genre => {
                      const linkAttributes = worksV2Link({ query: `genres:"${genre.label}"`, page: undefined });
                      return (<NextLink key={1} href={linkAttributes.href} as={linkAttributes.as}>
                        <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{genre.label}</a>
                      </NextLink>);
                    }
                    )} />
                  }

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
                      <NextLink key={1} {...worksV2Link({ query: `language:"${work.language.label}"`, page: undefined })}>
                        <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{work.language.label}</a>
                      </NextLink>
                    ]} />
                  }

                  {encoreLink &&
                    <div className={spacing({s: 2}, {margin: ['top']})}>
                      <PrimaryLink name='View Wellcome Library catalogue record' url={encoreLink} />
                    </div>
                  }

                </div>

                {licenseInfo &&
                  <Fragment>
                    <h2 className={`${font({s: 'HNM5', m: 'HNM4'})} ${spacing({s: 0}, {margin: ['top']})} ${spacing({s: 2}, {margin: ['bottom']})}`}>
                  Using this Image
                    </h2>
                    <MetaUnit headingLevel={3} headingText='License information' text={licenseInfo.humanReadableText} />
                    <MetaUnit headingLevel={3} headingText='Credit' text={[
                      `${work.title}. Credit: <a href="https://wellcomecollection.org/works/${work.id}">${iiifImageLocationCredit}</a>. ${licenseInfo.url ? `<a href="${licenseInfo.url}">${licenseInfo.text}</a>` : licenseInfo.text}`]} />
                  </Fragment>
                }

              </div>

              <div className={classNames([
                grid({s: 12, m: 10, shiftM: 1, l: 5, xl: 5}),
                spacing({s: 1}, {margin: ['top']})
              ])}>
                {iiifImageLocationUrl &&
                  <Fragment>
                    <h2 className={classNames([
                      font({s: 'HNM4', m: 'HNM3'}),
                      spacing({s: 0}, {margin: ['top']}),
                      spacing({s: 2}, {margin: ['bottom']})
                    ])}>
                    Download
                    </h2>

                    <div className={spacing({s: 2}, {margin: ['bottom']})}>
                      <Button
                        type='tertiary'
                        url={convertImageUri(iiifImageLocationUrl, 'full')}
                        target='_blank'
                        download={`${work.id}.jpg`}
                        rel='noopener noreferrer'
                        trackingEvent={{
                          category: 'component',
                          action: 'download-button:click',
                          label: `id: work.id , size:original, title:${encodeURI(work.title.substring(50))}`
                        }}
                        clickHandler={() => {
                          ReactGA.event({
                            category: 'component',
                            action: 'download-button:click',
                            label: `id: work.id , size:original, title:${encodeURI(work.title.substring(50))}`
                          });
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
                          category: 'component',
                          action: 'download-button:click',
                          label: `id: work.id , size:760, title:${work.title.substring(50)}`
                        }}
                        clickHandler={() => {
                          ReactGA.event({
                            category: 'component',
                            action: 'download-button:click',
                            label: `id: work.id , size:760, title:${work.title.substring(50)}`
                          });
                        }}
                        icon='download'
                        text='Download small (760px)' />
                    </div>
                  </Fragment>
                }

                {(iiifImageLocationCredit ||  iiifImageLocationLicenseId) &&
                  <div className={spacing({s: 4}, {margin: ['bottom']})}>
                    {iiifImageLocationCredit && <p className={classNames([
                      font({s: 'HNL5', m: 'HNL4'}),
                      spacing({s: 1}, {margin: ['bottom']})
                    ])}>Credit: {iiifImageLocationCredit}</p>}
                    {iiifImageLocationLicenseId && <License subject={''} licenseType={iiifImageLocationLicenseId} /> }
                  </div>}

                <div className={spacing({s: 2}, {margin: ['top']})}>
                  <Divider extraClasses={`divider--pumice divider--keyline ${spacing({s: 1}, {margin: ['top', 'bottom']})}`} />
                  <h2 className={classNames([
                    font({s: 'HNM4', m: 'HNM3'}),
                    spacing({s: 2}, {margin: ['top']}),
                    spacing({s: 1}, {margin: ['bottom']})
                  ])}>
                    Share
                  </h2>
                  <CopyUrl id={work.id} url={`https://wellcomecollection.org/works/${work.id}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </PageLayout>
  );
};

WorkPage.getInitialProps = async (context) => {
  const {id} = context.query;
  const {asPath} = context;
  const queryStart = asPath.indexOf('?');
  const previousQueryString = queryStart > -1 && asPath.slice(queryStart);
  const work = await getWork({ id });
  const showRedesign = Boolean(context.query.toggles.showWorkRedesign);

  return {
    previousQueryString,
    work: (work: Work),
    oEmbedUrl: `https://wellcomecollection.org/oembed/works/${work.id}`,
    pageJsonLd: workLd(work),
    showRedesign
  };
};

export default WorkPage;
