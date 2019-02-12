// @flow
import type { LicenseData } from '@weco/common/utils/get-license-info';
import type { LicenseType } from '@weco/common/model/license';
import { useState } from 'react';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import styled from 'styled-components';
import { font, spacing, classNames } from '@weco/common/utils/classnames';
import License from '@weco/common/views/components/License/LicenseBeta';
import Icon from '@weco/common/views/components/Icon/Icon';

const DownloadButton = styled.button`
  text-align: center;
  border: 0;
  background: ${props => props.theme.colors.green};
  color: ${props => props.theme.colors.white};
  padding: ${props =>
    `${props.theme.spacingUnit * 2}px ${props.theme.spacingUnit * 2}px ${props
      .theme.spacingUnit * 2}px ${props.theme.spacingUnit * 3}px`};
  cursor: pointer;
  :focus {
    outline: none;
    box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.3);
  }
  .icon {
    transition: transform 200ms;
    transform: ${props =>
      props.rotateIcon ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
  .icon__shape {
    fill: currentColor;
  }
`;
const DownloadOptions = styled.div`
  border: ${props => `1px solid ${props.theme.colors.marble}`};
  background: white;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.3);
  position: absolute;
  z-index: 1;
  padding: ${props => `${props.theme.spacingUnit * 3}px`};
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
type Props = {|
  work: Object,
  iiifImageLocationUrl: ?string,
  licenseInfo: ?LicenseData,
  iiifImageLocationCredit: ?string,
  iiifImageLocationLicenseId: ?LicenseType,
  encoreLink: ?string,
|};

const Download = ({
  work,
  iiifImageLocationUrl,
  licenseInfo,
  iiifImageLocationCredit,
  iiifImageLocationLicenseId,
}: Props) => {
  const [showDownloads, setShowDownloads] = useState(false);
  return (
    <div>
      <p
        className={classNames({
          [font({ s: 'HNL5', m: 'HNL4' })]: true,
        })}
      >
        <DownloadButton
          className={classNames({
            [font({ s: 'HNM4' })]: true,
            'flex-inline': true,
            'flex--v-center': true,
          })}
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
              Download this image
            </span>
            <Icon name="chevron" />
          </span>
        </DownloadButton>
        {showDownloads && (
          <DownloadOptions className={font({ s: 'HNM5', m: 'HNM4' })}>
            <ul className="plain-list no-margin no-padding">
              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={convertImageUri(iiifImageLocationUrl, 'full')}
                >
                  <span className="flex-inline flex--v-center">
                    <Icon name="download" />
                    <span className="underline-on-hover">
                      Download full size
                    </span>
                    <span
                      className={classNames({
                        'font-pewter': true,
                        'font-HNM5-s': true,
                        [spacing({ s: 2 }, { margin: ['left'] })]: true,
                      })}
                    >
                      JPG
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={convertImageUri(iiifImageLocationUrl, 760)}
                >
                  <span className="flex-inline flex--v-center">
                    <Icon name="download" />
                    <span className="underline-on-hover">
                      Download small (760px)
                    </span>
                    <span
                      className={classNames({
                        'font-pewter': true,
                        'font-HNM5-s': true,
                        [spacing({ s: 2 }, { margin: ['left'] })]: true,
                      })}
                    >
                      JPG
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </DownloadOptions>
        )}
        {(iiifImageLocationCredit || iiifImageLocationLicenseId) &&
          (iiifImageLocationCredit && (
            <span
              className={classNames({
                [spacing({ s: 1 }, { margin: ['top', 'left'] })]: true,
                'inline-block': true,
                nowrap: true,
              })}
            >
              {iiifImageLocationLicenseId && (
                <License
                  subject={''}
                  licenseType={iiifImageLocationLicenseId}
                />
              )}
              Credit: {iiifImageLocationCredit}
            </span>
          ))}
      </p>
    </div>
  );
};

export default Download;

// TODO aria stuff - controls? live?
// TODO put in tracking
//        trackingEvent={{
//   category: 'Button',
//   action: 'download large work image',
//   label: work.id,
// }}

// trackingEvent={{
//   category: 'Button',
//   action: 'download small work image',
//   label: work.id,
// }}
