// @flow
import type { LicenseData } from '@weco/common/utils/get-license-info';
import type { LicenseType } from '@weco/common/model/license';
import { type IIIFRendering } from '@weco/common/model/iiif';
import { trackEvent } from '@weco/common/utils/ga';
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { font, classNames } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import Icon from '@weco/common/views/components/Icon/Icon';
import Divider from '@weco/common/views/components/Divider/Divider';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Space from '@weco/common/views/components/styled/Space';
import WorkDetailsText from '../WorkDetailsText/WorkDetailsText';

const DownloadOptions = styled.div.attrs(props => ({
  className: classNames({
    [font('hnm', 4)]: true,
  }),
}))`
  min-width: 300px;
  border: ${props => `1px solid ${props.theme.colors.marble}`};
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
  background: ${props => `${props.theme.colors.white}`};
  color: ${props => `${props.theme.colors.black}`};
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.3);
  padding: ${props => `${props.theme.spacingUnit * 3}px`};
  position: absolute;
  z-index: 1;
  top: calc(100% + ${props => `${props.theme.spacingUnit * 2}px`});
  right: 0;
  display: ${props => (props.hidden ? 'none' : 'show')};

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
  const wrapperRef = useRef(null);
  const downloadText = useRef(null);
  useEffect(() => {
    window.document.addEventListener('click', handleClickOutside, false);
    return () => {
      window.document.removeEventListener('click', handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = event => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowDownloads(false);
    }
  };
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
      ref={wrapperRef}
      className={classNames({
        'inline-block': true,
        relative: true,
      })}
    >
      <Button
        extraClasses={classNames({
          relative: true,
          'btn--primary-black': true,
        })}
        icon="download"
        iconPosition="end"
        fontFamily="hnl"
        text="Downloads"
        ariaControls="downloadOptions"
        ariaExpanded={showDownloads}
        clickHandler={() => {
          setShowDownloads(!showDownloads);
        }}
      />
      <DownloadOptions id="downloadOptions" hidden={!showDownloads}>
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
                          <Space
                            as="span"
                            h={{ size: 'm', properties: ['margin-left'] }}
                            className={classNames({
                              'font-pewter': true,
                              [font('hnm', 5)]: true,
                            })}
                          >
                            {format}
                          </Space>
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
              <WorkDetailsText
                title="License information"
                text={licenseInfo.humanReadableText}
              />
              <WorkDetailsText
                title="Credit"
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
