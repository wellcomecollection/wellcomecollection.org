// @flow
import type { LicenseData } from '@weco/common/utils/get-license-info';
import { type IIIFRendering } from '@weco/common/model/iiif';
import { trackEvent } from '@weco/common/utils/ga';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { font, spacing, classNames } from '@weco/common/utils/classnames';
import License from '@weco/common/views/components/License/License';
import Icon from '@weco/common/views/components/Icon/Icon';

const DownloadButton = styled.button`
  text-align: center;
  border: ${props => `1px solid ${props.theme.colors.green}`};
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.green};
  padding: ${props =>
    `${props.theme.spacingUnit}px ${props.theme.spacingUnit}px ${
      props.theme.spacingUnit
    }px ${props.theme.spacingUnit * 2}px`};
  display: inline-block;
  margin: ${props =>
    `0 ${props.theme.spacingUnit * 2}px ${props.theme.spacingUnit}px 0`};
  cursor: pointer;
  :focus {
    outline: none;
    box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.3);
  }
  .icon {
    transition: transform 700ms;
    transform: ${props =>
      props.rotateIcon ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
  .icon__shape {
    fill: currentColor;
  }
`;
const DownloadOptions = styled.div`
  &.enhanced-styles {
    border: ${props => `1px solid ${props.theme.colors.marble}`};
    background: white;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.3);
    z-index: -1;
    margin-top: ${props => `-${props.theme.spacingUnit}px`};
    padding: ${props => `${props.theme.spacingUnit * 3}px`};
    height: none;
    opacity: 0;
    transition: opacity 400ms;
    position: absolute;
  }
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
    case 'video/mp4':
      return 'MP4';
    case 'audio/mp3':
      return 'MP3';
  }
}

type Work = Object;
type Props = {|
  work: Work,
  licenseInfo: ?LicenseData,
  credit: ?string,
  downloadOptions: IIIFRendering[],
|};

const Download = ({ work, licenseInfo, credit, downloadOptions }: Props) => {
  const [showDownloads, setShowDownloads] = useState(true);
  const [useJavascriptControl, setUseJavascriptControl] = useState(false);
  useEffect(() => {
    setUseJavascriptControl(true);
    setShowDownloads(false);
  }, []);
  return (
    <div>
      <div
        className={classNames({
          [font('hnl', 5)]: true,
        })}
      >
        {useJavascriptControl ? (
          <h2 className="inline">
            <DownloadButton
              className={classNames({
                [font('hnm', 5)]: true,
                'flex-inline': true,
                'flex--v-center': true,
              })}
              aria-controls="downloadOptions"
              aria-expanded={showDownloads}
              rotateIcon={showDownloads}
              onClick={() => {
                setShowDownloads(!showDownloads);
              }}
            >
              <span className="flex-inline flex--v-center">
                <span
                  className={classNames({
                    [spacing({ s: 1 }, { margin: ['right'] })]: true,
                  })}
                >
                  Download
                </span>
                <Icon name="chevron" />
              </span>
            </DownloadButton>
          </h2>
        ) : (
          <h2
            className={classNames({
              [font('wb', 3)]: true,
              'work-details-heading': true,
            })}
          >
            Download
          </h2>
        )}
        <DownloadOptions
          id="downloadOptions"
          className={classNames({
            [font('hnm', 5)]: true,
            'enhanced-styles': useJavascriptControl,
            show: showDownloads,
          })}
        >
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
                              [font('hnm', 5)]: true,
                              'font-pewter': true,
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
        </DownloadOptions>

        <div className="flex-inline flex--v-center">
          {licenseInfo && (
            <span
              className={classNames({
                'inline-block': true,
                [spacing({ s: 2 }, { margin: ['right'] })]: true,
              })}
            >
              {licenseInfo && (
                <License subject={''} licenseInfo={licenseInfo} />
              )}
            </span>
          )}
          {credit && (
            <span
              className={classNames({
                'inline-block': true,
                [spacing({ s: 2 }, { margin: ['right'] })]: true,
              })}
            >
              Credit: {credit}{' '}
            </span>
          )}
          {licenseInfo && (
            <a
              href="#licenseInformation"
              className={classNames({
                [font('hnm', 5)]: true,
              })}
            >
              <span className="flex-inline flex--v-center nowrap">
                <Icon name="arrowSmall" extraClasses="icon--90" />
                Can I use this?
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Download;
