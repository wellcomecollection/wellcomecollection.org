// @flow
import { type Context } from 'next';
import {
  type Work,
  type CatalogueApiError,
} from '@weco/common/model/catalogue';
import { classNames, font } from '@weco/common/utils/classnames';
import {
  getDownloadOptionsFromImageUrl,
  getDigitalLocationOfType,
} from '@weco/common/utils/works';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';
import {
  getDownloadOptionsFromManifest,
  getIIIFPresentationCredit,
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
  const iiifImageLocation =
    work && work.type !== 'Error'
      ? getDigitalLocationOfType(work, 'iiif-image')
      : null;
  const iiifPresentationLocation =
    work && work.type !== 'Error'
      ? getDigitalLocationOfType(work, 'iiif-presentation')
      : null;
  const digitalLocation = iiifImageLocation || iiifPresentationLocation;
  const license =
    digitalLocation &&
    digitalLocation.license &&
    getAugmentedLicenseInfo(digitalLocation.license);

  const iiifImageLocationUrl =
    iiifImageLocation &&
    iiifImageLocation.type === 'DigitalLocation' &&
    iiifImageLocation.url;

  const iiifImageDownloadOptions = iiifImageLocationUrl
    ? getDownloadOptionsFromImageUrl(iiifImageLocationUrl, null)
    : [];
  const iiifPresentationDownloadOptions = manifest
    ? getDownloadOptionsFromManifest(manifest)
    : [];

  const downloadOptions = [
    ...iiifImageDownloadOptions,
    ...iiifPresentationDownloadOptions,
  ];

  const credit =
    (iiifImageLocation && iiifImageLocation.credit) ||
    (manifest && getIIIFPresentationCredit(manifest));
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
          {work && work.id && (
            <SpacingComponent>
              <Download
                ariaControlsId="itemDownloads"
                workId={work.id}
                downloadOptions={downloadOptions}
              />
            </SpacingComponent>
          )}
          {license && (
            <SpacingComponent key={license.url}>
              <div>
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
                  ? `<a href="${license.url}">${license.label}</a>`
                  : license.label
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
  const work = await getWork({ id: workId });
  return {
    workId,
    sierraId,
    manifest,
    work,
  };
};

export default DownloadPage;
