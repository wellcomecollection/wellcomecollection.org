// @flow
import { type Context } from 'next';
import {
  type Work,
  type CatalogueApiError,
} from '@weco/common/model/catalogue';
import { classNames, font, spacing } from '@weco/common/utils/classnames';
import {
  getDownloadOptionsFromManifest,
  getDownloadOptionsFromImageUrl,
  getLocationType,
} from '@weco/common/utils/works';
import {
  getIIIFPresentationLicenceInfo,
  getIIIFImageLicenceInfo,
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
import MetaUnit from '@weco/common/views/components/MetaUnit/MetaUnit';

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

  const iiifImageLocation = work && getLocationType(work, 'iiif-image');
  const iiifImageLocationUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImageLocationCredit =
    iiifImageLocation && getIIIFImageCredit(iiifImageLocation);

  const downloadOptions = iiifImageLocationUrl
    ? getDownloadOptionsFromImageUrl(iiifImageLocationUrl)
    : [];

  const allDownloadOptions = [
    ...downloadOptions,
    ...iiifPresentationDownloadOptions,
  ];

  const iiifPresentationLicenseInfo =
    manifest && getIIIFPresentationLicenceInfo(manifest);

  const iiifImageLicenseInfo =
    iiifImageLocation && getIIIFImageLicenceInfo(iiifImageLocation);

  const iiifPresentationCredit =
    manifest && getIIIFPresentationCredit(manifest);

  const licenseInfo = iiifImageLicenseInfo || iiifPresentationLicenseInfo;
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
            <h1
              id="work-info"
              className={classNames({
                [spacing({ s: 4 }, { margin: ['top'] })]: true,
                [font('hnm', 1)]: true,
              })}
            >
              {title}
            </h1>
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
          {licenseInfo && (
            <SpacingComponent>
              <div id="licenseInformation">
                <MetaUnit
                  headingLevel={3}
                  headingText="License information"
                  text={licenseInfo.humanReadableText}
                />
                <MetaUnit
                  headingLevel={3}
                  headingText="Credit"
                  text={[
                    `${title.replace(/\.$/g, '')}.${' '}
              ${
                credit
                  ? `Credit: <a href="https://wellcomecollection.org/works/${workId}">${credit}</a>. `
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
            </SpacingComponent>
          )}
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
