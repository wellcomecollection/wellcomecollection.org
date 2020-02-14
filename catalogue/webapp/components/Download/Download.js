// @flow
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { type IIIFRendering } from '@weco/common/model/iiif';
import { useState, useEffect, useContext, useRef } from 'react';
import styled from 'styled-components';
import { font, classNames } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import DownloadLink from '@weco/catalogue/components/DownloadLink/DownloadLink';
// temporary
import Button from '@weco/common/views/components/Buttons/Button/Button';

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

export const DownloadOptions = styled.div.attrs(props => ({
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
  left: ${props => (props.alignment === 'left' ? 0 : 'auto')};
  right: ${props => (props.alignment === 'left' ? 'auto' : 0)};
  display: ${props => (props.hidden ? 'none' : 'show')};

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

type Work = Object;
type Props = {|
  work: Work,
  downloadOptions: IIIFRendering[],
|};

const Download = ({ work, downloadOptions }: Props) => {
  const [showDownloads, setShowDownloads] = useState(true);
  const [alignment, setAlignment] = useState('left');
  const downloadOptionsContainer = useRef(null);
  const { isEnhanced } = useContext(AppContext);
  function setAlignmentOfDownloadOptions() {
    if (downloadOptionsContainer && downloadOptionsContainer.current) {
      if (
        downloadOptionsContainer.current.getBoundingClientRect().x <
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
    >
      {downloadOptions.length > 0 && (
        <>
          {isEnhanced ? (
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
                  setAlignmentOfDownloadOptions();
                }}
              >
                <span className="flex-inline flex--v-center">
                  <Space
                    as="span"
                    h={{ size: 's', properties: ['margin-right'] }}
                  >
                    Downloads
                  </Space>
                  <Icon name="chevron" />
                </span>
              </DownloadButton>
            </h2>
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
          <div style={{ background: 'black' }}>
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
          </div>
          <DownloadOptions
            ref={downloadOptionsContainer}
            id="downloadOptions"
            className={classNames({
              [font('hnm', 5)]: true,
              'enhanced-styles': isEnhanced,
              hidden: !showDownloads,
            })}
            alignment={alignment}
          >
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
                      <DownloadLink
                        isTabbable={showDownloads}
                        href={option['@id']}
                        linkText={option.label}
                        format={format}
                        trackingEvent={{
                          category: 'Button',
                          action: action,
                          label: work.id,
                        }}
                      />
                    </li>
                  );
                })}
            </ul>
          </DownloadOptions>
        </>
      )}
    </div>
  );
};

export default Download;
