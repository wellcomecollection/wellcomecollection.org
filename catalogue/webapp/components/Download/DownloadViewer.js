// @flow
import type { LicenseData } from '@weco/common/utils/get-license-info';
import type { LicenseType } from '@weco/common/model/license';
import { type IIIFRendering } from '@weco/common/model/iiif';
import { trackEvent } from '@weco/common/utils/ga';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { font, spacing, classNames } from '@weco/common/utils/classnames';
import MetaUnit from '@weco/common/views/components/MetaUnit/MetaUnit';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import Icon from '@weco/common/views/components/Icon/Icon';
import Divider from '@weco/common/views/components/Divider/Divider';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

const DownloadOptions = styled.div`
  position: relative;
  border: ${props => `1px solid ${props.theme.colors.marble}`};
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
  background: ${props => `${props.theme.colors.white}`};
  color: ${props => `${props.theme.colors.black}`};
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.3);
  z-index: -1;
  padding: ${props => `${props.theme.spacingUnit * 3}px`};
  height: none;
  opacity: 0;
  transition: opacity 400ms;
  position: absolute;
  top: calc(100% + ${props => `${props.theme.spacingUnit * 2}px`});
  right: 0;

  &.show {
    z-index: 1;
    opacity: 1;
  }
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

type Work = Object;
type Props = {|
  title: string,
  work: Work,
  licenseInfo: ?LicenseData,
  iiifImageLocationCredit: ?string,
  iiifImageLocationLicenseId: ?LicenseType,
  downloadOptions: IIIFRendering[],
|};

const Download = ({
  title,
  work,
  licenseInfo,
  iiifImageLocationCredit,
  iiifImageLocationLicenseId,
  downloadOptions,
}: Props) => {
  const [showDownloads, setShowDownloads] = useState(false);
  const [useJavascriptControl, setUseJavascriptControl] = useState(false);

  useEffect(() => {
    setUseJavascriptControl(true);
    setShowDownloads(false);
  }, []);
  return (
    <div className="inline-block relative">
      <div
        className={classNames({
          [font({ s: 'HNL5', m: 'HNL4' })]: true,
        })}
      >
        <Button
          type="tertiary"
          extraClasses={classNames({
            'btn--tertiary-black': true,
            [spacing({ s: 1 }, { margin: ['left'] })]: true,
          })}
          icon="download"
          text="Download"
          clickHandler={() => {
            setShowDownloads(!showDownloads);
          }}
        />
        <DownloadOptions
          id="downloadOptions"
          className={classNames({
            [font({ s: 'HNM5', m: 'HNM4' })]: true,
            'enhanced-styles': useJavascriptControl,
            show: showDownloads,
          })}
        >
          <SpacingComponent>
            <ul className="plain-list no-margin no-padding">
              {downloadOptions
                .filter(option => option.format !== 'text/plain') // We're taking out raw text for now
                .map(option => {
                  // Doing this for the action so analytics is constant, speak to Hayley about removing this
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
                            label: work.id,
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
                      ? `Credit: <a href="https://wellcomecollection.org/works/${
                          work.id
                        }">${iiifImageLocationCredit}</a>. `
                      : ` `
                  }
                  ${
                    licenseInfo.url
                      ? `<a href="${licenseInfo.url}">${licenseInfo.text}</a>`
                      : licenseInfo.text
                  }`,
                ]}
              />
            </SpacingComponent>
          )}
        </DownloadOptions>
      </div>
    </div>
  );
};

export default Download;
