// @flow
import type { LicenseData } from '@weco/common/utils/get-license-info';
import type { LicenseType } from '@weco/common/model/license';
import { type IIIFRendering } from '@weco/common/model/iiif';
import { trackEvent } from '@weco/common/utils/ga';
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { font, spacing, classNames } from '@weco/common/utils/classnames';
import MetaUnit from '@weco/common/views/components/MetaUnit/MetaUnit';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import Icon from '@weco/common/views/components/Icon/Icon';
import Divider from '@weco/common/views/components/Divider/Divider';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

const DownloadOptions = styled.div.attrs(props => ({
  className: classNames({
    [font({ s: 'HNM5', m: 'HNM4' })]: true,
  }),
}))`
  min-width: 300px;
  border: ${props => `1px solid ${props.theme.colors.marble}`};
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
  background: ${props => `${props.theme.colors.white}`};
  color: ${props => `${props.theme.colors.black}`};
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.3);
  padding: ${props => `${props.theme.spacingUnit * 3}px`};
  display: none;
  position: absolute;
  top: calc(100% + ${props => `${props.theme.spacingUnit * 2}px`});
  right: 0;
  ${props => props.show && `display: block;`}

  li + li {
    margin-top: ${props => `${props.theme.spacingUnit * 2}px`};
  }
  a {
    color: ${props => props.theme.colors.green};
    text-decoration: none;
  }
  .icon__canvas {
    height: 1.3em;
  }
  .icon__shape {
    fill: currentColor;
  }
`;

function getFormatString(format) {
  switch (format) {
    case 'application/pdf':
      return 'PDF';
    case 'text/plain':
      return 'PLAIN';
    case 'image/jpeg':
      return 'JPG';
  }
}

type Props = {|
  title: string,
  workId: string,
  licenseInfo: ?LicenseData,
  iiifImageLocationCredit: ?string,
  iiifImageLocationLicenseId: ?LicenseType,
  downloadOptions: IIIFRendering[],
|};

const Download = ({
  title,
  workId,
  licenseInfo,
  iiifImageLocationCredit,
  iiifImageLocationLicenseId,
  downloadOptions,
}: Props) => {
  const [showDownloads, setShowDownloads] = useState(false);
  const downloadText = useRef(null);
  useEffect(() => {
    const links =
      downloadText &&
      downloadText.current &&
      downloadText.current.getElementsByTagName('a');
    if (links) {
      for (const link of links) {
        link.setAttribute('tabindex', showDownloads ? '0' : '-1');
      }
    }
  }, [showDownloads]);
  return (
    <div
      className={classNames({
        'inline-block': true,
        relative: true,
      })}
    >
      <Button
        type="tertiary"
        extraClasses={classNames({
          relative: true,
          'btn--secondary-black': true,
          'btn--small': true,
          [spacing({ s: 1 }, { margin: ['left'] })]: true,
        })}
        icon="download"
        text="Download"
        clickHandler={() => {
          setShowDownloads(!showDownloads);
        }}
      />
      <DownloadOptions id="downloadOptions" show={showDownloads}>
        <SpacingComponent>
          <ul className="plain-list no-margin no-padding">
            {downloadOptions
              .filter(option => option.format !== 'text/plain') // We're taking out raw text for now
              .map(option => {
                const action =
                  option.label === 'Download full size'
                    ? 'download large work image'
                    : option.label === 'Download small (760px)'
                    ? 'download small work image'
                    : option.label;
                const format = getFormatString(option.format);

                return (
                  <li key={option.label}>
                    <a
                      tabIndex={showDownloads ? null : -1}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={option['@id']}
                      onClick={() => {
                        trackEvent({
                          category: 'Button',
                          action: action,
                          label: workId,
                        });
                      }}
                    >
                      <span className="flex-inline flex--v-center">
                        <Icon name="download" />
                        <span className="underline-on-hover">
                          {option.label}
                        </span>
                        {format && (
                          <span
                            className={classNames({
                              'font-pewter': true,
                              [font({ s: 'HNM5' })]: true,
                              [spacing({ s: 2 }, { margin: ['left'] })]: true,
                            })}
                          >
                            {format}
                          </span>
                        )}
                      </span>
                    </a>
                  </li>
                );
              })}
          </ul>
        </SpacingComponent>
        <SpacingComponent>
          <Divider extraClasses="divider--pumice divider--keyline" />
        </SpacingComponent>
        {licenseInfo && (
          <SpacingComponent>
            <div ref={downloadText}>
              <MetaUnit
                headingLevel={3}
                headingText="License information"
                text={licenseInfo.humanReadableText}
              />
              <MetaUnit
                headingLevel={3}
                headingText="Credit"
                text={[
                  `${title}. ${
                    iiifImageLocationCredit
                      ? `Credit: <a href="https://wellcomecollection.org/works/${workId}">${iiifImageLocationCredit}</a>. `
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
      </DownloadOptions>
    </div>
  );
};

export default Download;
