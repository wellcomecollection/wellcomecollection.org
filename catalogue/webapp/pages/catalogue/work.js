// @flow
import fetch from 'isomorphic-unfetch';
import {font, spacing, grid, classNames} from '@weco/common/utils/classnames';
import {iiifImageTemplate, convertImageUri} from '@weco/common/utils/convert-image-uri';
import PageDescription from '@weco/common/views/components/PageDescription/PageDescription';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import WorkMedia2 from '@weco/common/views/components/WorkMedia/WorkMedia2';
import Icon from '@weco/common/views/components/Icon/Icon';
import PrimaryLink from '@weco/common/views/components/Links/PrimaryLink/PrimaryLink';
import WorkDrawer from '@weco/common/views/components/WorkDrawer/WorkDrawer';
import License from '@weco/common/views/components/License/License';
import Divider from '@weco/common/views/components/Divider/Divider';
import CopyUrl from '@weco/common/views/components/CopyUrl/CopyUrl';
import MetaUnit from '@weco/common/views/components/MetaUnit/MetaUnit';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import {Fragment} from 'react';

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
    url: prepend ? `/catalogue/works?query=${encodeURIComponent(`${prepend}"${val}"`)}` : `/catalogue/works?query=${encodeURI(`"${val}"`)}`
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
  work: Work
|}

const WorkPage = ({work}: Props) => {
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
  const attribution = constructAttribution(work, credit, `https://wellcomecollection.org/catalogue/works/${work.id}`);

  return (
    <Fragment>
      <PageDescription title='Search our images' extraClasses='page-description--hidden' />
      <InfoBanner text={`Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`} cookieName='WC_wellcomeImagesRedirect' />

      <WorkMedia2 id={work.id} iiifUrl={iiifInfoUrl} title={work.title} />

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
                    We’re improving the information on this page. <a href='/progress'>Find out more</a>.
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

              <div className={spacing({s: 1}, {margin: ['bottom']})}>
                <Button
                  extraClasses='btn--tertiary'
                  url={convertImageUri(work.items[0].locations[0].url, 'full')}
                  target='_blank'
                  download={`${work.id}.jpg`}
                  rel='noopener noreferrer'
                  eventTracking={JSON.stringify({
                    'category': 'component',
                    'action': 'download-button:click',
                    'label': `id: work.id , size:original, title:${work.title.substring(50)}`
                  })}
                  icon='download'
                  text='Download full size' />
              </div>

              <div className={spacing({s: 3}, {margin: ['bottom']})}>
                <Button
                  extraClasses='btn--tertiary'
                  url={convertImageUri(work.items[0].locations[0].url, 760)}
                  target='_blank'
                  download={`${work.id}.jpg`}
                  rel='noopener noreferrer'
                  eventTracking={JSON.stringify({
                    'category': 'component',
                    'action': 'download-button:click',
                    'label': `id: work.id , size:760, title:${work.title.substring(50)}`
                  })}
                  icon='download'
                  text='Download small (760px)' />
              </div>

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
                <CopyUrl id={work.id} url={`https://wellcomecollection.org/catalogue/works/${work.id}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

WorkPage.getInitialProps = async (context) => {
  const {id} = context.query;
  const res = await fetch(`https://api.wellcomecollection.org/catalogue/v1/works/${id}?includes=identifiers,items,thumbnail`);
  const json = await res.json();
  const [iiifImageLocation] = json.items.map(
    item => item.locations.find(
      location => location.locationType === 'iiif-image'
    )
  );
  const iiifInfoUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImage = iiifImageTemplate(iiifInfoUrl);
  return {
    title: json.title || json.description,
    description: json.description || '',
    type: 'website',
    url: `https://wellcomecollection.org/catalogue/works/${json.id}`,
    imageUrl: iiifImage({size: '800,'}),
    analyticsCategory: 'collections',
    siteSection: 'images',
    work: (json: Work) };
};

export default PageWrapper(WorkPage);
