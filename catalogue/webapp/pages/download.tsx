import { Work } from '@weco/common/model/catalogue';
import { classNames, font } from '@weco/common/utils/classnames';
import {
  getDownloadOptionsFromImageUrl,
  getDigitalLocationOfType,
} from '../utils/works';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';
import {
  getDownloadOptionsFromManifest,
  getIIIFPresentationCredit,
  getUiExtensions,
  isUiEnabled,
} from '../utils/iiif';
import { IIIFManifest } from '../model/iiif';
import { getWork } from '../services/catalogue/works';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Download from '@weco/catalogue/components/Download/Download';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import Space from '@weco/common/views/components/styled/Space';
import WorkDetailsText from '../components/WorkDetailsText/WorkDetailsText';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { GetServerSideProps, NextPage } from 'next';
import { appError, AppErrorProps } from '@weco/common/views/pages/_app';
import { getServerData } from '@weco/common/server-data';

type Props = {
  workId: string;
  sierraId: string;
  manifest?: IIIFManifest;
  work?: Work;
};

const DownloadPage: NextPage<Props> = ({
  workId,
  sierraId,
  manifest,
  work,
}) => {
  const title = (manifest && manifest.label) || (work && work.title) || '';
  const iiifImageLocation = work
    ? getDigitalLocationOfType(work, 'iiif-image')
    : null;
  const iiifPresentationLocation = work
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
    ? getDownloadOptionsFromImageUrl({
        url: iiifImageLocationUrl,
        width: undefined,
        height: undefined,
      })
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

  const showDownloadOptions = manifest
    ? isUiEnabled(getUiExtensions(manifest), 'mediaDownload')
    : true;

  return (
    <PageLayout
      title={title}
      description={''}
      url={{ pathname: `/works/${workId}/download`, query: { sierraId } }}
      openGraphType={'website'}
      jsonLd={{ '@type': 'WebPage' }}
      siteSection={'collections'}
      imageUrl={undefined}
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
                [font('hnb', 1)]: true,
              })}
            >
              {title}
            </Space>
          </SpacingComponent>
          {work && work.id && (
            <SpacingComponent>
              {showDownloadOptions ? (
                <Download
                  ariaControlsId="itemDownloads"
                  workId={work.id}
                  downloadOptions={downloadOptions}
                />
              ) : (
                <p>There are no downloads available.</p>
              )}
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

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { workId, sierraId } = context.query;

    if (typeof workId !== 'string' || typeof sierraId !== 'string') {
      return {
        notFound: true,
      };
    }

    const manifestUrl =
      sierraId && `https://wellcomelibrary.org/iiif/${sierraId}/manifest`;

    const manifest = manifestUrl && (await (await fetch(manifestUrl)).json());

    const work = await getWork({
      id: workId,
      toggles: serverData.toggles,
    });

    if (work.type === 'Error') {
      return appError(context, work.httpStatus, work.description);
    } else if (work.type === 'Redirect') {
      return {
        redirect: {
          destination: `/works/${work.redirectToId}/download`,
          permanent: work.status === 301,
        },
      };
    }

    return {
      props: removeUndefinedProps({
        workId,
        sierraId,
        manifest,
        work,
      }),
    };
  };

export default DownloadPage;
