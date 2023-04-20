import { ReactElement } from 'react';
import { Work } from '@weco/catalogue/services/wellcome/catalogue/types';
import { font } from '@weco/common/utils/classnames';
import {
  getDownloadOptionsFromImageUrl,
  getDigitalLocationOfType,
} from '@weco/catalogue/utils/works';
import {
  getCatalogueLicenseData,
  LicenseData,
} from '@weco/common/utils/licenses';
import { TransformedManifest } from '@weco/catalogue/types/manifest';
import { getWork } from '@weco/catalogue/services/wellcome/catalogue/works';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Download from '@weco/catalogue/components/Download/Download';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import Space from '@weco/common/views/components/styled/Space';
import WorkDetailsText from '@weco/catalogue/components/WorkDetailsText/WorkDetailsText';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { GetServerSideProps, NextPage } from 'next';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import { looksLikeCanonicalId } from '@weco/catalogue/services/wellcome/catalogue';
import { fetchIIIFPresentationManifest } from '@weco/catalogue/services/iiif/fetch/manifest';
import { transformManifest } from '@weco/catalogue/services/iiif/transformers/manifest';

function getCredit(
  workId: string,
  title: string,
  iiifImageLocationCredit: string | undefined,
  license: LicenseData
): ReactElement {
  const titleCredit = title.replace(/\.$/g, '');

  const linkCredit = iiifImageLocationCredit ? (
    <>
      Credit:{' '}
      <a href={`https://wellcomecollection.org/works/${workId}`}>
        {iiifImageLocationCredit}
      </a>
      .
    </>
  ) : null;

  const licenseCredit: ReactElement = license.url ? (
    <a href={license.url}>{license.label}</a>
  ) : (
    <>{license.label}</>
  );

  return (
    <div key="0">
      {titleCredit}. {linkCredit} {licenseCredit}
    </div>
  );
}

type Props = {
  workId: string;
  transformedManifest?: TransformedManifest;
  work?: Work;
};

const DownloadPage: NextPage<Props> = ({
  workId,
  transformedManifest,
  work,
}) => {
  const { title, downloadEnabled, downloadOptions, iiifCredit } = {
    ...transformedManifest,
  };
  const displayTitle = title || work?.title || '';
  const iiifImageLocation = work
    ? getDigitalLocationOfType(work, 'iiif-image')
    : null;
  const iiifPresentationLocation = work
    ? getDigitalLocationOfType(work, 'iiif-presentation')
    : null;
  const digitalLocation = iiifImageLocation || iiifPresentationLocation; // TODO here we favour imageLocation over manifestLocation
  const license =
    digitalLocation?.license &&
    getCatalogueLicenseData(digitalLocation.license);

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

  const allDownloadOptions = [
    ...iiifImageDownloadOptions,
    ...(downloadOptions || []),
  ];

  const credit = (iiifImageLocation && iiifImageLocation.credit) || iiifCredit;

  return (
    <PageLayout
      title={displayTitle}
      description=""
      url={{ pathname: `/works/${workId}/download` }}
      openGraphType="website"
      jsonLd={{ '@type': 'WebPage' }}
      siteSection="collections"
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
              className={font('intb', 1)}
            >
              {displayTitle}
            </Space>
          </SpacingComponent>
          {workId && (
            <SpacingComponent>
              {downloadEnabled && allDownloadOptions.length !== 0 ? (
                <Download
                  ariaControlsId="itemDownloads"
                  workId={workId}
                  downloadOptions={allDownloadOptions}
                />
              ) : (
                <p>There are no downloads available.</p>
              )}
            </SpacingComponent>
          )}
          {license && (
            <SpacingComponent key={license.url}>
              <div>
                {license.humanReadableText && (
                  <WorkDetailsText
                    title="License information"
                    contents={license.humanReadableText}
                  />
                )}
                {title && (
                  <WorkDetailsText
                    title="Credit"
                    contents={getCredit(workId, title, credit, license)}
                  />
                )}
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
    const { workId } = context.query;

    if (!looksLikeCanonicalId(workId)) {
      return {
        notFound: true,
      };
    }

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

    const manifestLocation = getDigitalLocationOfType(
      work,
      'iiif-presentation'
    );
    const iiifManifest =
      manifestLocation &&
      (await fetchIIIFPresentationManifest(manifestLocation.url));
    const transformedManifest = iiifManifest && transformManifest(iiifManifest);

    return {
      props: removeUndefinedProps({
        serverData,
        workId,
        transformedManifest,
        work,
      }),
    };
  };

export default DownloadPage;