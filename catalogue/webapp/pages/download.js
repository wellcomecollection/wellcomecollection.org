// @flow
import { type Context } from 'next';
import {
  type Work,
  type CatalogueApiError,
} from '@weco/common/model/catalogue';
import { classNames, font } from '@weco/common/utils/classnames';
import {
  getItemsLicenseInfo,
  getDownloadOptionsFromManifest,
  getDownloadOptionsFromImageUrl,
  getDigitalLocationOfType,
} from '@weco/common/utils/works';
import {
  getIIIFPresentationCredit,
  getIIIFImageCredit,
} from '@weco/common/utils/iiif';
import fetch from 'isomorphic-unfetch';
import { type IIIFManifest } from '@weco/common/model/iiif';
import { getWork } from '../services/catalogue/works';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Download from '@weco/catalogue/components/Download/Download';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import Space from '@weco/common/views/components/styled/Space';
import WorkDetailsText from '../components/WorkDetailsText/WorkDetailsText';

type Props = {|
  workId: string,
  sierraId: string,
  manifest: ?IIIFManifest,
  work: ?(Work | CatalogueApiError),
|};

const DownloadPage = ({ workId, sierraId, manifest, work }: Props) => {
  const title = (manifest && manifest.label) || (work && work.title) || '';
  const iiifPresentationDownloadOptions =
    (manifest && getDownloadOptionsFromManifest(manifest)) || []; // TODO abstract this for use here and in work(details)?

  const iiifImageLocation = work
    ? getDigitalLocationOfType(work, 'iiif-image')
    : null;

  const iiifImageLocationUrl =
    iiifImageLocation &&
    iiifImageLocation.type === 'DigitalLocation' &&
    iiifImageLocation.url;

  const iiifImageLocationCredit =
    iiifImageLocation && getIIIFImageCredit(iiifImageLocation);

  const downloadOptions = iiifImageLocationUrl
    ? getDownloadOptionsFromImageUrl(iiifImageLocationUrl)
    : [];

  const allDownloadOptions = [
    ...downloadOptions,
    ...iiifPresentationDownloadOptions,
  ];

  const iiifPresentationCredit =
    manifest && getIIIFPresentationCredit(manifest);

  const licenseInfo = getItemsLicenseInfo(work);
  const credit = iiifPresentationCredit || iiifImageLocationCredit;
  return (
    <PageLayout
      title={title}
      description={''}
      url={{ pathname: `/works/${workId}/download`, query: { sierraId } }}
      openGraphType={'website'}
      jsonLd={{ '@type': 'WebPage' }}
      siteSection={'works'}
      imageUrl={null}
      imageAltText={''}
      hideNewsletterPromo={true}
    >
      <Layout8>
        <SpacingSection>
          <SpacingComponent>
            <Space
              v={{
                size: 'l',
                properties: ['margin-top'],
              }}
              as="h1"
              id="work-info"
              className={classNames({
                [font('hnm', 1)]: true,
              })}
            >
              {title}
            </Space>
          </SpacingComponent>
          <SpacingComponent>
            <Download
              work={work}
              licenseInfo={licenseInfo}
              credit={credit}
              downloadOptions={allDownloadOptions}
              licenseInfoLink={false}
            />
          </SpacingComponent>
          {licenseInfo.length > 0 &&
            licenseInfo.map(license => (
              <SpacingComponent key={license.url}>
                <div id="licenseInformation">
                  {license.humanReadableText.length > 0 && (
                    <WorkDetailsText
                      title="License information"
                      text={license.humanReadableText}
                    />
                  )}
                  <WorkDetailsText
                    title="Credit"
                    text={[
                      `${title.replace(/\.$/g, '')}.${' '}
              ${
                credit
                  ? `Credit: <a href="https://wellcomecollection.org/works/${workId}">${credit}</a>. `
                  : ` `
              }
              ${
                license.url
                  ? `<a href="${license.url}">${license.text}</a>`
                  : license.text
              }`,
                    ]}
                  />
                </div>
              </SpacingComponent>
            ))}
        </SpacingSection>
      </Layout8>
    </PageLayout>
  );
};

DownloadPage.getInitialProps = async (ctx: Context): Promise<Props> => {
  const { workId, sierraId } = ctx.query;
  const manifestUrl = sierraId
    ? `https://wellcomelibrary.org/iiif/${sierraId}/manifest`
    : null;
  const manifest = manifestUrl ? await (await fetch(manifestUrl)).json() : null;

  // The sierraId originates from the iiif presentation manifest url
  // If we don't have one, we must be trying to display a work with an iiif image location,
  // so we need to get the work object to get the necessary data to display
  const work = !sierraId ? await getWork({ id: workId }) : null;

  return {
    workId,
    sierraId,
    manifest,
    work,
  };
};

export default DownloadPage;
