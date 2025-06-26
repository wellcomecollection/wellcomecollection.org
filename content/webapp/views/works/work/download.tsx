import { NextPage } from 'next';
import { FunctionComponent } from 'react';

import { DigitalLocation } from '@weco/common/model/catalogue';
import { font } from '@weco/common/utils/classnames';
import {
  getCatalogueLicenseData,
  LicenseData,
} from '@weco/common/utils/licenses';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageLayout from '@weco/common/views/components/PageLayout';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import Download from '@weco/content/components/Download';
import WorkDetailsText from '@weco/content/components/WorkDetails/WorkDetails.Text';
import {
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { TransformedManifest } from '@weco/content/types/manifest';
import {
  getDownloadOptionsFromCanvasRenderingAndSupplementing,
  getDownloadOptionsFromManifestRendering,
} from '@weco/content/utils/iiif/v3';
import { removeTrailingFullStop } from '@weco/content/utils/string';
import { getDigitalLocationOfType } from '@weco/content/utils/works';

type CreditProps = {
  workId: string;
  title: string;
  credit?: string;
  license: LicenseData;
};

const Credit: FunctionComponent<CreditProps> = ({
  workId,
  title,
  credit,
  license,
}) => {
  const titleCredit = removeTrailingFullStop(title);

  const linkCredit = credit && (
    <>
      Credit:{' '}
      <a href={`https://wellcomecollection.org/works/${workId}`}>{credit}</a>.
    </>
  );

  const licenseCredit = license.url ? (
    <a href={license.url}>{license.label}</a>
  ) : (
    <>{license.label}</>
  );

  return (
    <div>
      {titleCredit}. {linkCredit} {licenseCredit}
    </div>
  );
};

export type Props = {
  transformedManifest?: Pick<
    TransformedManifest,
    'title' | 'iiifCredit' | 'canvases' | 'rendering'
  >;
  work: WorkBasic & Pick<Work, 'items'>;
};

const WorkDownloadPage: NextPage<Props> = ({ transformedManifest, work }) => {
  const { title, iiifCredit, canvases, rendering } = {
    ...transformedManifest,
  };
  const displayTitle = title || work.title || '';
  const iiifImageLocation = getDigitalLocationOfType(work, 'iiif-image');
  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );

  // Determine digital location. If the work has a iiif-presentation location and a iiif-image location
  // we use the former
  const digitalLocation: DigitalLocation | undefined =
    iiifPresentationLocation || iiifImageLocation;

  const license =
    digitalLocation?.license &&
    getCatalogueLicenseData(digitalLocation.license);

  const manifestDownloadOptions =
    getDownloadOptionsFromManifestRendering(rendering);

  // We need this for old style pdfs that appear on supplementing
  const canvasDownloadOptions =
    canvases
      ?.map(canvas =>
        getDownloadOptionsFromCanvasRenderingAndSupplementing(canvas)
      )
      .flat() || [];

  const allDownloadOptions = [
    ...canvasDownloadOptions,
    ...manifestDownloadOptions,
  ];

  const credit = (iiifImageLocation && iiifImageLocation.credit) || iiifCredit;

  return (
    <PageLayout
      title={displayTitle}
      description=""
      url={{ pathname: `/works/${work.id}/download` }}
      openGraphType="website"
      jsonLd={{ '@type': 'WebPage' }}
      siteSection="collections"
      hideNewsletterPromo={true}
    >
      <ContaineredLayout gridSizes={gridSize8()}>
        <SpacingSection>
          <SpacingComponent>
            <Space
              as="h1"
              id="work-info"
              className={font('intb', 1)}
              $v={{ size: 'l', properties: ['margin-top'] }}
            >
              {displayTitle}
            </Space>
          </SpacingComponent>
          <SpacingComponent>
            {allDownloadOptions.length !== 0 ? (
              <Download
                ariaControlsId="itemDownloads"
                downloadOptions={allDownloadOptions}
              />
            ) : (
              <p>There are no downloads available.</p>
            )}
          </SpacingComponent>
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
                    contents={
                      <Credit
                        workId={work.id}
                        title={title}
                        credit={credit}
                        license={license}
                      />
                    }
                  />
                )}
              </div>
            </SpacingComponent>
          )}
        </SpacingSection>
      </ContaineredLayout>
    </PageLayout>
  );
};

export default WorkDownloadPage;
