// @flow
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { type IIIFRendering } from '@weco/common/model/iiif';
import { type LicenseData } from '@weco/common/utils/licenses';
import { useContext, useRef } from 'react';
import styled from 'styled-components';
import { font, classNames } from '@weco/common/utils/classnames';
import DownloadLink from '@weco/catalogue/components/DownloadLink/DownloadLink';
import Divider from '@weco/common/views/components/Divider/Divider';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import WorkDetailsText from '../WorkDetailsText/WorkDetailsText';
// $FlowFixMe (tsx)
import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';

export const DownloadOptions = styled.div.attrs(props => ({
  className: classNames({
    [font('hnm', 4)]: true,
  }),
}))`
  white-space: normal;
  color: ${props => props.theme.color('black')};

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
  isInline?: boolean,
|};

const Download = ({
  ariaControlsId,
  title = '',
  workId,
  downloadOptions,
  license,
  iiifImageLocationCredit,
  useDarkControl = false,
  isInline = false,
}: Props) => {
  const downloadsContainer = useRef(null);
  const { isEnhanced } = useContext(AppContext);

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
          <DropdownButton
            label="Downloads"
            isInline={isInline}
            isOnDark={useDarkControl}
          >
            <DownloadOptions
              id={ariaControlsId}
              className={classNames({
                [font('hnm', 5)]: true,
              })}
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
                        <li key={option['@id']}>
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
          </DropdownButton>
        </>
      )}
    </div>
  );
};

export default Download;
