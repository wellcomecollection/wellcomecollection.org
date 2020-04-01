// @flow
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { type IIIFRendering } from '@weco/common/model/iiif';
import type { LicenseData } from '@weco/common/utils/licenses';
import { useState, useEffect, useContext, useRef } from 'react';
import styled from 'styled-components';
import { font, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import DownloadLink from '@weco/catalogue/components/DownloadLink/DownloadLink';
import Divider from '@weco/common/views/components/Divider/Divider';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import WorkDetailsText from '../WorkDetailsText/WorkDetailsText';
import Button from '@weco/common/views/components/Buttons/Button/Button';

export const DownloadOptions = styled.div.attrs(props => ({
  className: classNames({
    [font('hnm', 4)]: true,
  }),
}))`
  ${props =>
    props.enhancedStyles &&
    `min-width: 300px;
    border: 1px solid ${props.theme.colors.marble};
    border-radius: ${props.theme.borderRadiusUnit}px;
    background: ${props.theme.colors.white};
    color: ${props.theme.colors.black};
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.3);
    padding: ${props.theme.spacingUnit * 3}px;
    position: absolute;
    z-index: 1;
    top: calc(100% + ${props.theme.spacingUnit * 2}px);
    left: ${props.alignment === 'left' ? 0 : 'auto'};
    right: ${props.alignment === 'left' ? 'auto' : 0};
    display: ${props.hidden ? 'none' : 'block'};
    `}

  li + li {
    margin-top: ${props => `${props.theme.spacingUnit * 2}px`};
  }
`;

export function getFormatString(format: string) {
  switch (format) {
    case 'application/pdf':
      return 'PDF';
    case 'text/plain':
      return 'PLAIN';
    case 'image/jpeg':
      return 'JPG';
    case 'video/mp4':
      return 'MP4';
    case 'audio/mp3':
      return 'MP3';
    default:
      return null;
  }
}

type Props = {|
  ariaControlsId: string,
  workId: string,
  downloadOptions: IIIFRendering[],
  title?: string,
  license?: ?LicenseData,
  iiifImageLocationCredit?: ?string,
  useDarkControl?: boolean,
|};

const Download = ({
  ariaControlsId,
  title = '',
  workId,
  downloadOptions,
  license,
  iiifImageLocationCredit,
  useDarkControl = false,
}: Props) => {
  const [showDownloads, setShowDownloads] = useState(true);
  const [alignment, setAlignment] = useState('left');
  const downloadsContainer = useRef(null);
  const { isEnhanced } = useContext(AppContext);
  function setAlignmentOfDownloadOptions() {
    if (downloadsContainer && downloadsContainer.current) {
      if (
        downloadsContainer.current.getBoundingClientRect().left <
        window.innerWidth / 2
      ) {
        setAlignment('left');
      } else {
        setAlignment('right');
      }
    }
  }
  useEffect(() => {
    setShowDownloads(false);
  }, []);
  return (
    <div
      className={classNames({
        [font('hnl', 5)]: true,
        'inline-block': isEnhanced,
        relative: true,
      })}
      ref={downloadsContainer}
    >
      {downloadOptions.length > 0 && (
        <>
          {isEnhanced ? (
            <>
              <h2 className="inline">
                <Button
                  extraClasses={classNames({
                    relative: true,
                    'btn--tertiary': !useDarkControl,
                    'btn--primary-black': useDarkControl,
                  })}
                  icon={useDarkControl ? 'download' : 'chevron'}
                  iconPosition="end"
                  fontFamily={useDarkControl ? 'hnl' : 'hnm'}
                  text="Downloads"
                  ariaControls={ariaControlsId}
                  ariaExpanded={showDownloads}
                  clickHandler={() => {
                    setShowDownloads(!showDownloads);
                    setAlignmentOfDownloadOptions();
                  }}
                />
              </h2>
            </>
          ) : (
            <Space
              v={{
                size: 'l',
                properties: ['margin-top'],
              }}
            >
              <h2
                className={classNames({
                  [font('hnm', 5)]: true,
                  'work-details-heading': true,
                })}
              >
                Download
              </h2>
            </Space>
          )}
          <DownloadOptions
            id={ariaControlsId}
            className={classNames({
              [font('hnm', 5)]: true,
            })}
            alignment={alignment}
            aria-hidden={!showDownloads}
            hidden={!showDownloads}
            enhancedStyles={isEnhanced}
          >
            <SpacingComponent>
              <ul className="plain-list no-margin no-padding">
                {downloadOptions
                  .filter(option => option.format !== 'text/plain') // We're taking out raw text for now
                  .map(option => {
                    const action = option['@id'].match(/\/full\/full\//)
                      ? 'download large work image'
                      : option['@id'].match(/\/full\/760/)
                      ? 'download small work image'
                      : option.label;
                    const format = getFormatString(option.format);

                    return (
                      <li key={option.label}>
                        <DownloadLink
                          href={option['@id']}
                          linkText={
                            option.label === 'Download as PDF'
                              ? 'Whole item'
                              : option.label
                          }
                          format={format}
                          trackingEvent={{
                            category: 'Button',
                            action: action,
                            label: workId,
                          }}
                        />
                      </li>
                    );
                  })}
              </ul>
            </SpacingComponent>
            {license && (
              <>
                <SpacingComponent>
                  <Divider extraClasses="divider--pumice divider--keyline" />
                </SpacingComponent>
                <SpacingComponent>
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
                        `${title}. ${
                          iiifImageLocationCredit
                            ? `Credit: <a href="https://wellcomecollection.org/works/${workId}">${iiifImageLocationCredit}</a>. `
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
              </>
            )}
          </DownloadOptions>
        </>
      )}
    </div>
  );
};

export default Download;
