// @flow
import {Fragment} from 'react';
import ReactGA from 'react-ga';
import {font, spacing, grid, classNames} from '@weco/common/utils/classnames';
import {iiifImageTemplate, convertImageUri} from '@weco/common/utils/convert-image-uri';
import PageDescription from '@weco/common/views/components/PageDescription/PageDescription';
import {default as PageWrapper, pageStore} from '@weco/common/views/components/PageWrapper/PageWrapper';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import Icon from '@weco/common/views/components/Icon/Icon';
import PrimaryLink from '@weco/common/views/components/Links/PrimaryLink/PrimaryLink';
import WorkDrawer from '@weco/common/views/components/WorkDrawer/WorkDrawer';
import License from '@weco/common/views/components/License/License';
import Divider from '@weco/common/views/components/Divider/Divider';
import CopyUrl from '@weco/common/views/components/CopyUrl/CopyUrl';
import MetaUnit from '@weco/common/views/components/MetaUnit/MetaUnit';
import SecondaryLink from '@weco/common/views/components/Links/SecondaryLink/SecondaryLink';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import {workLd} from '@weco/common/utils/json-ld';
import WorkMedia from '../components/WorkMedia/WorkMedia';
import {getWork} from '../services/catalogue/works';

export type Link = {|
  text: string;
  url: string;
|};

const licenseMap = {
  'copyright-not-cleared': {
    text: 'Copyright not cleared',
    humanReadableText: ['Copyright for this work has not been cleared. You are responsible for identifying the rights owner to seek permission to use this work.']
  },
  'PDM': {
    url: 'https://creativecommons.org/publicdomain/mark/1.0/',
    text: 'Public Domain',
    icons: ['cc_pdm'],
    humanReadableText: ['You can use this work for any purpose without restriction under copyright law.', 'Public Domain Mark (PDM) terms and conditions <a href="https://creativecommons.org/publicdomain/mark/1.0">https://creativecommons.org/publicdomain/mark/1.0</a>']
  },
  'CC-0': {
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    text: 'CC0',
    icons: ['cc_zero'],
    description: 'Free to use for any purpose',
    humanReadableText: ['You can use this work for any purpose without restriction under copyright law.', 'Creative Commons Zero (CC0) terms and conditions <a href="https://creativecommons.org/publicdomain/zero/1.0">https://creativecommons.org/publicdomain/zero/1.0</a>']
  },
  'CC-BY': {
    url: 'https://creativecommons.org/licenses/by/4.0/',
    text: 'CC BY',
    icons: ['cc', 'cc_by'],
    description: 'Free to use with attribution',
    humanReadableText: ['You can use this work for any purpose, including commercial uses, without restriction under copyright law. You should also provide attribution to the original work, source and licence.', 'Creative Commons Attribution (CC BY 4.0) terms and conditions <a href="https://creativecommons.org/licenses/by/4.0">https://creativecommons.org/licenses/by/4.0</a>']
  },
  'CC-BY-NC': {
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
    text: 'CC BY-NC',
    icons: ['cc', 'cc_by', 'cc_nc'],
    description: 'Free to use with attribution for non-commercial purposes',
    humanReadableText: ['You can use this work for any purpose, as long as it is not primarily intended for or directed to commercial advantage or monetary compensation. You should also provide attribution to the original work, source and licence.', 'Creative Commons Attribution Non-Commercial (CC BY-NC 4.0) terms and conditions <a href="https://creativecommons.org/licenses/by-nc/4.0">https://creativecommons.org/licenses/by-nc/4.0</a>']
  },
  'CC-BY-NC-ND': {
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    text: 'CC BY-NC-ND',
    icons: ['cc', 'cc_by', 'cc_nc', 'cc_nd'],
    description: 'Free to use with attribution for non-commercial purposes. No modifications permitted.',
    humanReadableText: ['You can copy and distribute this work, as long as it is not primarily intended for or directed to commercial advantage or monetary compensation. You should also provide attribution to the original work, source and licence.', 'If you make any modifications to or derivatives of the work, it may not be distributed.', 'Creative Commons Attribution Non-Commercial No-Derivatives (CC BY-NC-ND 4.0) terms and conditions <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">https://creativecommons.org/licenses/by-nc-nd/4.0/</a>']
  }
};

function constructCreatorsString(creators) {
  if (creators.length > 0) {
    const creatorsString =  creators.reduce((acc, creator, index) => {
      if (index === 0) {
        return `${acc} ${creator.label}`;
      } else if (index + 1 === creators.length) {
        return `${acc} and ${creator.label}`;
      } else {
        return `${acc}, ${creator.label}`;
      }
    }, 'by');
    return creatorsString;
  } else {
    return '';
  }
}

function constructLicenseString(licenseType) {
  const licenseInfo = getLicenseInfo(licenseType);
  return `<a href="${licenseInfo.url}">${licenseInfo.text}</a>`;
}

function constructAttribution(singleWork, credit, canonicalUri) {
  const title = singleWork.title ? `'${singleWork.title}' ` : '';
  const creators = constructCreatorsString(singleWork.creators);
  const license = constructLicenseString(singleWork.thumbnail.license.licenseType);
  return [`${title} ${creators}. Credit: <a href="${canonicalUri}">${credit}</a>. ${license}`];
}

function getLicenseInfo(licenseType) {
  return licenseMap[licenseType];
}

function createLinkObject(val: string, prepend?: string): Link {
  return {
    text: val,
    url: prepend ? `/works?query=${encodeURIComponent(`${prepend}"${val}"`)}` : `/works?query=${encodeURI(`"${val}"`)}`
  };
}

function getLinkObjects(objectArray: Array<{}>, objectKey: string, prepend?: string) {
  return objectArray.map((object) => {
    return createLinkObject(object[objectKey], prepend);
  });
}

function getMetaContentArray(singleWork, descriptionArray) {
  const contentArray = [];

  if (singleWork.creators && singleWork.creators.length > 0) {
    contentArray.push({
      type: 'creators',
      heading: 'By',
      links: getLinkObjects(singleWork.creators, 'label', 'creators:'),
      text: []
    });
  }
  if (singleWork.createdDate && singleWork.createdDate.label) {
    contentArray.push({
      heading: 'Date',
      text: [singleWork.createdDate.label],
      links: []
    });
  }
  if (singleWork.genres && singleWork.genres.length > 0) {
    contentArray.push({
      heading: 'Genre',
      links: getLinkObjects(singleWork.genres, 'label'),
      text: []
    });
  }
  if (singleWork.subjects && singleWork.subjects.length > 0) {
    contentArray.push({
      heading: 'Subject',
      links: getLinkObjects(singleWork.subjects, 'label'),
      text: []
    });
  }
  if (singleWork.lettering && singleWork.lettering.length > 0) {
    contentArray.push({
      heading: 'Lettering',
      text: [singleWork.lettering],
      links: []
    });
  }
  if (descriptionArray && descriptionArray.length > 0) {
    contentArray.push({
      heading: 'Description',
      text: descriptionArray,
      links: []
    });
  }
  return contentArray;
}

// Not sure we want to type this not dynamically
// as the API is subject to change?
type Work = Object;
type Props = {|
  work: Work,
  previousQueryString: ?string,
  page: ?number,
  version: ?number
|}

export const WorkPage = ({
  work,
  previousQueryString,
  version
}: Props) => {
  if (version === 2) {
    const digitalLocation = work.items && work.items.map((item) => {
      return item.locations.find((location) => {
        return location.type === 'DigitalLocation';
      });
    }).filter(Boolean);

    const iiifManifest = digitalLocation.length > 0 ? digitalLocation[0].url
      : work.id === 'prrf9sds' ? 'https://wellcomelibrary.org/iiif/b19743919/manifest' // not in catalogue API as currently only added if material type is ebook
        : work.id === 'nzn2vaju' ? 'https://wellcomelibrary.org/iiif/b15701712/manifest' /// not in catalogue API as currently only added if material type is ebook
          : null;

    return (
      <div className='container'>
        {iiifManifest && <div className='grid'>
          <div className={grid({s: 12})}>
            <div className={spacing({ s: 2 }, { margin: ['top'] })}>
              <div className='uv' data-locale='en-GB:English (GB)' data-config='https://wellcomelibrary.org/assets/config/uv-config.json' data-uri={iiifManifest} data-collectionindex='0' data-manifestindex='0' data-sequenceindex='0' data-canvasindex='0' data-zoom='-1.1484,-0.0834,3.2969,1.6681'
                style={{'width': '1068px', 'height': '600px', 'backgroundColor': '#000'}} data-rotation='0'></div>
              <script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js'></script>
              <script type='text/javascript' id='embedUV'
                src='https://wellcomelibrary.org/spas/uv/versions/uv-1.7.32/lib/embed.js'></script>
            </div>
          </div>
        </div>}

        <div className='grid'>
          <div className={grid({s: 12})}>
            <div className={spacing({ s: 2 }, { margin: ['top'] })}>
              <b>Title:</b> {work.title}
            </div>
            <div>
              <b>Description:</b> {work.description}
            </div>
            <div className={spacing({ s: 2 }, { margin: ['top'] })}>
              <b>Physical description:</b> {work.physicalDescription}
            </div>
            <div className={spacing({ s: 2 }, { margin: ['top'] })}>
              <b>Work type:</b> {work.workType && work.workType.label}
            </div>
            <div className={spacing({ s: 2 }, { margin: ['top'] })}>
              <b>Extent:</b> {work.extent}
            </div>
            <div className={spacing({ s: 2 }, { margin: ['top'] })}>
              <b>Lettering:</b> {work.lettering}
            </div>
            <div className={spacing({ s: 2 }, { margin: ['top'] })}>
              <b>Created date:</b> {work.createdDate && work.createdDate.label}
            </div>
            <div className={spacing({ s: 2 }, { margin: ['top'] })}>
              <b>Contributors:</b>
              <ul>
                {work.contributors.map(contributor => (
                  <li key={contributor.agent.label}>
                    <div><b>Agent:</b> {contributor.agent.label}</div>
                    <div><b>Roles:</b> {contributor.roles.map(role => role.label).join(', ')}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className={spacing({ s: 2 }, { margin: ['top'] })}>
              <b>Identifiers:</b>
              <ul>
                {work.identifiers.map(identifier => (
                  <li key={identifier.value}>
                    <div><b>Type:</b> {identifier.identifierType.label}</div>
                    <div><b>Value:</b> {identifier.value}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className={spacing({ s: 2 }, { margin: ['top'] })}>
              <b>Subjects:</b>
              <ul>
                {work.subjects.map(subject => (
                  <li key={subject.label}>{subject.label}</li>
                ))}
              </ul>
            </div>

            <div className={spacing({ s: 2 }, { margin: ['top'] })}>
              <b>Genres:</b>
              <ul>
                {work.genres.map(genre => (
                  <li key={genre.label}>{genre.label}</li>
                ))}
              </ul>
            </div>

            <div className={spacing({ s: 2 }, { margin: ['top'] })}>
              <b>Thumbnail:</b>
              {work.thumbnail && <ul>
                <li>URL: {work.thumbnail.url}</li>
                <li>License: {JSON.stringify(work.thumbnail.license)}</li>
              </ul>}
            </div>

            <div className={spacing({ s: 2 }, { margin: ['top'] })}>
              <b>Items:</b>
              <ul>
                {work.items.map(item => (
                  <li key={item.id}>
                    <div><b>ID: {item.id}</b></div>
                    <div>
                      <b>Locations</b>
                      <ul>
                        {item.locations.map((location, i) => (
                          <div key={`location${i}`}>
                            <div><b>{location.type}: {location.label || location.url}</b></div>
                            <div>{location.locationType.label}</div>
                          </div>
                        ))}
                      </ul>
                    </div>

                  </li>
                ))}
              </ul>
            </div>

            <div className={spacing({ s: 2 }, { margin: ['top'] })}>
              <b>Production:</b>
              <ul>
                {work.production.map((productionEvent, i) => (
                  <li key={`productionEvent${i}`}>
                    <div>
                      <b>Places:</b>
                      <ul>
                        {productionEvent.places.map(place => (
                          <li key={place.label}>{place.label}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <b>Agents:</b>
                      <ul>
                        {productionEvent.agents.map(agent => (
                          <li key={agent.label}>{agent.label}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <b>Dates:</b>
                      <ul>
                        {productionEvent.dates.map(date => (
                          <li key={date.label}>{date.label}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className={spacing({ s: 2 }, { margin: ['top'] })}><b>Language:</b> {work.language && work.language.label}</div>

            <div className={spacing({ s: 2 }, { margin: ['top'] })}><b>Dimensions:</b> {work.dimensions}</div>

            <div className={spacing({ s: 2 }, { margin: ['top'] })}><b>Type:</b> {work.type}</div>
          </div>
        </div>
      </div>
    );
  }

  const [iiifImageLocation] = work.items.map(
    item => item.locations.find(
      location => location.locationType === 'iiif-image'
    )
  );
  const iiifInfoUrl = iiifImageLocation && iiifImageLocation.url;

  const sierraId = (work.identifiers.find(identifier =>
    identifier.identifierScheme === 'sierra-system-number'
  ) || {}).value;
  // We strip the last character as that's what Wellcome Library expect
  const encoreLink = sierraId && `http://search.wellcomelibrary.org/iii/encore/record/C__R${sierraId.substr(0, sierraId.length - 1)}`;

  const descriptionArray = work.description && work.description.split('\n');
  const metaContent = getMetaContentArray(work, descriptionArray);
  const credit = work.items[0].locations[0].credit;
  const attribution = constructAttribution(work, credit, `https://wellcomecollection.org/works/${work.id}`);
  const workImageUrl = work.items[0].locations[0].url;

  return (
    <Fragment>
      <PageDescription title='Search our images' extraClasses='page-description--hidden' />
      <InfoBanner text={`Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`} cookieName='WC_wellcomeImagesRedirect' />

      {previousQueryString && <div className='row'>
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

      {version !== 2 &&
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

                    {metaContent.map((metaItem, i) => {
                      return <MetaUnit key={i} headingText={metaItem.heading} text={metaItem.text} links={metaItem.links} includeDivider={i === metaContent.length - 1} />;
                    })}

                    {encoreLink &&
                      <div className={spacing({s: 2}, {margin: ['top']})}>
                        <PrimaryLink name='View Wellcome Library catalogue record' url={encoreLink} />
                      </div>
                    }
                  </div>

                  <WorkDrawer data={[{
                    headingText: 'License information',
                    text: getLicenseInfo(work.thumbnail.license.licenseType).humanReadableText
                  }, {
                    headingText: 'Credit',
                    text: attribution
                  }]} />
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

                  <div className={spacing({s: 4}, {margin: ['bottom']})}>
                    <p className={classNames([
                      font({s: 'HNL5', m: 'HNL4'}),
                      spacing({s: 1}, {margin: ['bottom']})
                    ])}>Credit: {credit}</p>

                    {/* TODO: the download links once this is in
                    https://github.com/wellcometrust/wellcomecollection.org/pull/2164/files#diff-f9d8c53a2dbf55f0c9190e6fbd99e45cR21 */}
                    {/* the small one is 760 */}
                    <License subject={''} licenseType={work.thumbnail.license.licenseType} />
                  </div>

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
      }
    </Fragment>
  );
};

WorkPage.getInitialProps = async (context) => {
  const {id} = context.query;
  const {asPath} = context;
  const queryStart = asPath.indexOf('?');
  const previousQueryString = queryStart > -1 && asPath.slice(queryStart);
  const version = pageStore('toggles').apiV2 ? 2 : 1;
  const work = await getWork({id, version});

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
    version,
    pageJsonLd: workLd(work)
  };
};

export default PageWrapper(WorkPage);
