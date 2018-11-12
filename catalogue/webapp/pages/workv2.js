// @flow
import {Fragment} from 'react';
import ReactGA from 'react-ga';
import NextLink from 'next/link';
import {font, spacing, grid, classNames} from '@weco/common/utils/classnames';
import {iiifImageTemplate, convertImageUri} from '@weco/common/utils/convert-image-uri';
import PageDescription from '@weco/common/views/components/PageDescription/PageDescription';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import Icon from '@weco/common/views/components/Icon/Icon';
import PrimaryLink from '@weco/common/views/components/Links/PrimaryLink/PrimaryLink';
import License from '@weco/common/views/components/License/License';
import Divider from '@weco/common/views/components/Divider/Divider';
import CopyUrl from '@weco/common/views/components/CopyUrl/CopyUrl';
import SecondaryLink from '@weco/common/views/components/Links/SecondaryLink/SecondaryLink';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import {workLd} from '@weco/common/utils/json-ld';
import WorkMedia from '../components/WorkMedia/WorkMedia';
import {getWork} from '../services/catalogue/worksv2';
import {worksV2Link} from '../services/catalogue/links';

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
  page: ?number
|}

export const WorkPage = ({
  work,
  previousQueryString
}: Props) => {
  const [iiifImageLocation] = work.items.map(
    item => item.locations.find(
      location => location.locationType.id === 'iiif-image' ||
                  location.locationType.id === 'iiif-presentation'
    )
  ).filter(Boolean);
  const iiifInfoUrl = iiifImageLocation && iiifImageLocation.url;

  const sierraId = (work.identifiers.find(identifier =>
    identifier.identifierType.id === 'sierra-system-number'
  ) || {}).value;
  // We strip the last character as that's what Wellcome Library expect
  const encoreLink = sierraId && `http://search.wellcomelibrary.org/iii/encore/record/C__R${sierraId.substr(0, sierraId.length - 1)}`;
  const workImageUrl = work.items.length > 0 && work.items[0].locations.length > 0 && work.items[0].locations[0].url;

  return (
    <Fragment>
      <PageDescription title='Search our images' extraClasses='page-description--hidden' />
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
        {iiifInfoUrl && <WorkMedia
          id={work.id}
          iiifUrl={iiifInfoUrl}
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
                    <div>
                      <h2 className='h3'>Description</h2>
                      <p>{work.description}</p>
                    </div>

                  }

                  {work.physicalDescription &&
                    <div>
                      <h2 className='h3'>Physical description</h2>
                      <p>{work.physicalDescription}</p>
                    </div>
                  }

                  {work.workType &&
                    <div>
                      <h2 className='h3'>Work type</h2>
                      <p>
                        <NextLink {...worksV2Link({ query: `workType:"${work.workType.label}"`, page: undefined })}>
                          <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{work.workType.label}</a>
                        </NextLink>
                      </p>
                    </div>
                  }

                  {work.extent &&
                    <div>
                      <h2 className='h3'>Extent</h2>
                      <p>{work.extent}</p>
                    </div>
                  }

                  {work.lettering &&
                    <div>
                      <h2 className='h3'>Lettering</h2>
                      <p>{work.lettering}</p>
                    </div>
                  }

                  {work.createdDate &&
                    <div>
                      <h2 className='h3'>Created date</h2>
                      <p>{work.createdDate.label}</p>
                    </div>
                  }

                  {work.contributors.length > 0 &&
                    <div>
                      <h2 className='h3'>Contributors</h2>
                      <ul className='plain-list no-margin no-padding'>
                        {work.contributors.map(contributor => {
                          return (
                            <li
                              className='inline'
                              key={contributor.agent.label}>
                              <NextLink {...worksV2Link({ query: `contributors:"${contributor.agent.label}"`, page: undefined })}>
                                <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{contributor.agent.label}</a>
                              </NextLink>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  }

                  {work.subjects.length > 0 &&
                    <div>
                      <h2 className='h3'>Subjects</h2>
                      <ul className='plain-list no-margin no-padding'>
                        {work.subjects.map(subject => {
                          return (
                            <li
                              className='inline'
                              key={subject.label}>
                              <NextLink  {...worksV2Link({ query: `subjects:"${subject.label}"`, page: undefined })}>
                                <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{subject.label}</a>
                              </NextLink>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  }

                  {work.genres.length > 0 &&
                    <div>
                      <h2 className='h3'>Genres</h2>
                      <ul className='plain-list no-margin no-padding'>
                        {work.genres.map(genre => {
                          return (
                            <li
                              className='inline'
                              key={genre.label}>
                              <NextLink {...worksV2Link({ query: `genres:"${genre.label}"`, page: undefined })}>
                                <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{genre.label}</a>
                              </NextLink>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  }

                  {work.production.length > 0 &&
                    <div>
                      <h2 className='h3'>Production</h2>
                      {work.production.map(production => {
                        return (
                          <div key={production.function}>
                            {production.places.length > 0 &&
                              <div>
                                <h3>Places</h3>
                                <ul>
                                  {production.places.map(place => {
                                    return (
                                      <li key={place.label}>{place.label}</li>
                                    );
                                  })}
                                </ul>
                              </div>
                            }
                            {production.agents.length > 0 &&
                            <div>
                              <h3>Agents</h3>
                              <ul>
                                {production.agents.map(agent => {
                                  return (
                                    <li key={agent.label}>{agent.label}</li>
                                  );
                                })}
                              </ul>
                            </div>
                            }
                            {production.dates.length > 0 &&
                            <div>
                              <h3>Dates</h3>
                              <ul>
                                {production.dates.map(dates => {
                                  return (
                                    <li key={dates.label}>{dates.label}</li>
                                  );
                                })}
                              </ul>
                            </div>
                            }
                          </div>
                        );
                      })}
                    </div>
                  }

                  {work.language &&
                    <div>
                      <h2 className='h3'>Language</h2>
                      <p>
                        <NextLink {...worksV2Link({ query: `language:"${work.language.label}"`, page: undefined })}>
                          <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{work.language.label}</a>
                        </NextLink>
                      </p>
                    </div>
                  }

                  {work.dimensions &&
                    <div>
                      <h2 className='h3'>Dimensions</h2>
                      <p>
                        <NextLink {...worksV2Link({ query: `dimensions:"${work.dimensions}"`, page: undefined })}>
                          <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{work.dimensions}</a>
                        </NextLink>
                      </p>
                    </div>
                  }

                  {work.type &&
                    <div>
                      <h2 className='h3'>Type</h2>
                      <p>
                        <NextLink {...worksV2Link({ query: `query=type:"${work.type}"`, page: undefined })}>
                          <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>
                            {work.type}
                          </a>
                        </NextLink>
                      </p>
                    </div>
                  }

                  {encoreLink &&
                    <div className={spacing({s: 2}, {margin: ['top']})}>
                      <PrimaryLink name='View Wellcome Library catalogue record' url={encoreLink} />
                    </div>
                  }
                </div>
              </div>

              <div className={classNames([
                grid({s: 12, m: 10, shiftM: 1, l: 5, xl: 5}),
                spacing({s: 1}, {margin: ['top']})
              ])}>
                <h2 className={classNames([
                  font({s: 'HNM4', m: 'HNM3'}),
                  spacing({s: 0}, {margin: ['top']}),
                  spacing({s: 2}, {margin: ['bottom']})
                ])}>
                  Download
                </h2>

                {workImageUrl && <div className={spacing({s: 2}, {margin: ['bottom']})}>
                  <Button
                    type='tertiary'
                    url={convertImageUri(workImageUrl, 'full')}
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
                </div>}

                {workImageUrl && <div className={spacing({s: 3}, {margin: ['bottom']})}>
                  <Button
                    type='tertiary'
                    url={convertImageUri(workImageUrl, 760)}
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
                </div>}

                {work.thumbnail && work.thumbnail.license && <div className={spacing({s: 4}, {margin: ['bottom']})}>
                  {work.items.length > 0 && work.items[0].locations.length > 0 &&
                    <p className={classNames([
                      font({s: 'HNL5', m: 'HNL4'}),
                      spacing({s: 1}, {margin: ['bottom']})
                    ])}>Credit: {work.items[0].locations[0].credit}</p>
                  }

                  {/* TODO: the download links once this is in
                  https://github.com/wellcometrust/wellcomecollection.org/pull/2164/files#diff-f9d8c53a2dbf55f0c9190e6fbd99e45cR21 */}
                  {/* the small one is 760 */}
                  <License subject={''} licenseType={work.thumbnail.license.licenseType} />
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
    </Fragment>
  );
};

WorkPage.getInitialProps = async (context) => {
  const {id} = context.query;
  const {asPath} = context;
  const queryStart = asPath.indexOf('?');
  const previousQueryString = queryStart > -1 && asPath.slice(queryStart);
  const work = await getWork({ id });

  if (work.type === 'Error') {
    return { statusCode: work.httpStatus };
  }

  const [iiifImageLocation] = work.items.map(
    item => item.locations.find(
      location => location.locationType === 'iiif-image'
    )
  );

  const iiifInfoUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImage = iiifInfoUrl && iiifImageTemplate(iiifInfoUrl);

  return {
    title: work.title || work.description,
    description: work.description || '',
    type: 'website',
    canonicalUrl: `https://wellcomecollection.org/works/${work.id}`,
    imageUrl: iiifImage ? iiifImage({size: '800,'}) : null,
    analyticsCategory: 'collections',
    siteSection: 'images',
    previousQueryString,
    work: (work: Work),
    oEmbedUrl: `https://wellcomecollection.org/oembed/works/${work.id}`,
    pageJsonLd: workLd(work)
  };
};

export default PageWrapper(WorkPage);
