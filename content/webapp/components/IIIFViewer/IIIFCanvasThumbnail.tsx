import { IIIFExternalWebResource } from '@iiif/presentation-3';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { audio, file, video } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import Icon from '@weco/common/views/components/Icon';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import { IIIFItemProps } from '@weco/content/components/IIIFItem';
import { TransformedCanvas } from '@weco/content/types/manifest';
import {
  isAudioCanvas,
  isChoiceBody,
  isPDFCanvas,
} from '@weco/content/utils/iiif/v3';

import IIIFViewerImage from './IIIFViewerImage';
import Padlock from './Padlock';

const IIIFViewerThumb = styled.span`
  cursor: pointer;
  display: block;
  height: 100%;
  width: 300px;
  max-width: 90%;
  border-radius: 8px;
  background: ${props => props.theme.color('black')};
  padding: 12px 16px;
  text-align: center;
  margin: auto;

  [aria-current='true'] & {
    background: ${props => props.theme.color('neutral.700')};
  }
`;

const IIIFViewerThumbInner = styled.span`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ImageContainer = styled.span`
  flex-grow: 1;
  position: relative;

  img {
    position: absolute;
    max-height: 100%;
    max-width: 100%;
    height: auto;
    width: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const IIIFViewerThumbNumber = styled.span.attrs({
  className: font('intb', 6),
})`
  padding: 3px 6px;
  border-radius: 3px;
  line-height: 1;
  color: ${props => props.theme.color('white')};

  [aria-current='true'] & {
    color: ${props => props.theme.color('black')};
    background-color: ${props => props.theme.color('yellow')};
  }
`;

const IconWrapper = styled.span`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type IIIFCanvasThumbnailProps = {
  canvas: TransformedCanvas;
  thumbNumber: number;
  highlightImage?: boolean;
  placeholderId?: string;
};

const IIIFCanvasThumbnail: FunctionComponent<IIIFCanvasThumbnailProps> = ({
  canvas,
  thumbNumber,
  highlightImage,
  placeholderId,
}: IIIFCanvasThumbnailProps) => {
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const { userIsStaffWithRestricted } = useUserContext();
  const isRestricted = canvas.hasRestrictedImage;
  const urlTemplate = canvas.imageServiceId
    ? iiifImageTemplate(canvas.imageServiceId)
    : undefined;

  const thumbnailSrc =
    canvas?.thumbnailImage?.url ||
    (urlTemplate && urlTemplate({ size: '200,' })) ||
    placeholderId;

  const itemType = isChoiceBody(canvas?.painting?.[0])
    ? (canvas.painting[0].items[0] as IIIFExternalWebResource | IIIFItemProps)
        ?.type
    : canvas.painting?.[0]?.type;

  const hasIconPlaceholder =
    !thumbnailSrc &&
    (itemType === 'Sound' || isAudioCanvas(canvas) || isPDFCanvas(canvas));

  return (
    <IIIFViewerThumb>
      <IIIFViewerThumbInner>
        <ImageContainer>
          {isRestricted && !userIsStaffWithRestricted && (
            <>
              <Padlock />
              <span className="visually-hidden">
                Thumbnail image is not available
              </span>
            </>
          )}

          {!isRestricted && (
            <>
              {thumbnailSrc ? (
                <>
                  {!thumbnailLoaded && <LL $small={true} $lighten={true} />}

                  <IIIFViewerImage
                    highlightImage={highlightImage}
                    width={canvas?.thumbnailImage?.width || 30}
                    src={thumbnailSrc}
                    srcSet=""
                    sizes={`${canvas?.thumbnailImage?.width || 30}px`}
                    alt=""
                    loadHandler={() => {
                      setThumbnailLoaded(true);
                    }}
                  />
                </>
              ) : (
                <>
                  {hasIconPlaceholder && (
                    <IconWrapper>
                      <Icon
                        icon={
                          itemType === 'Sound'
                            ? audio
                            : itemType === 'Video'
                              ? video
                              : file
                        }
                        iconColor="white"
                        sizeOverride="width: 53px; height: 53px;"
                      />
                    </IconWrapper>
                  )}
                </>
              )}
            </>
          )}
        </ImageContainer>

        <div>
          <Space $v={{ size: 's', properties: ['margin-bottom'] }}>
            <IIIFViewerThumbNumber>
              {canvas.label?.trim() !== '-' && 'page'} {canvas.label}
            </IIIFViewerThumbNumber>
          </Space>
          <div>
            <IIIFViewerThumbNumber>
              <span style={{ fontSize: '11px' }}>{`${thumbNumber}`}</span>
            </IIIFViewerThumbNumber>
          </div>
        </div>
      </IIIFViewerThumbInner>
    </IIIFViewerThumb>
  );
};

export default IIIFCanvasThumbnail;
