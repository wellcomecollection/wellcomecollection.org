import { FunctionComponent, useState } from 'react';
import { IIIFCanvas } from '../../model/iiif';
import { font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import IIIFViewerImage from './IIIFViewerImage';
import LL from '@weco/common/views/components/styled/LL';
import { isImageRestricted, getThumbnailService } from '../../utils/iiif/v2';
import Padlock from './Padlock';
import Space from '@weco/common/views/components/styled/Space';

type ViewerThumbProps = {
  isFocusable?: boolean;
  isActive?: boolean;
};

const IIIFViewerThumb = styled.button.attrs<ViewerThumbProps>(props => ({
  tabIndex: props.isFocusable ? 0 : -1,
}))<ViewerThumbProps>`
  appearance: none;
  font-family: inherit;
  letter-spacing: inherit;
  cursor: pointer;
  border: 0;
  display: block;
  height: 100%;
  width: 300px;
  max-width: 90%;
  border-radius: 8px;
  background: ${props =>
    props.theme.color(props.isActive ? 'neutral.700' : 'black')};
  padding: 12px 16px;
  text-align: center;
  margin: auto;
  &:focus {
    outline: ${props => `1px solid ${props.theme.color('yellow')}`};
  }
`;

const IIIFViewerThumbInner = styled.span`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ImageContainer = styled.div`
  flex-grow: 1;
  position: relative;
  img {
    position: absolute;
    top: 0;
    left: 0;
    max-height: 100%;
    max-width: 100%;
    height: auto;
    width: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const IIIFViewerThumbNumber = styled.span.attrs<ViewerThumbProps>({
  className: font('intb', 6),
})<ViewerThumbProps>`
  padding: 3px 6px;
  border-radius: 3px;
  line-height: 1;

  ${props =>
    props.isActive
      ? `
    color: ${props.theme.color('black')};
    background-color: ${props.theme.color('yellow')};`
      : `
    color: ${props.theme.color('white')};
    
    `};
`;

type IIIFCanvasThumbnailProps = {
  canvas: IIIFCanvas;
  isActive: boolean;
  thumbNumber: number;
  clickHandler?: () => void;
  isFocusable?: boolean;
  highlightImage?: boolean;
};

const IIIFCanvasThumbnail: FunctionComponent<IIIFCanvasThumbnailProps> = ({
  canvas,
  clickHandler,
  isActive,
  thumbNumber,
  isFocusable,
  highlightImage,
}: IIIFCanvasThumbnailProps) => {
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const thumbnailService = getThumbnailService(canvas);
  const urlTemplate =
    thumbnailService && iiifImageTemplate(thumbnailService['@id']);
  const isRestricted = isImageRestricted(canvas);
  const preferredMinThumbnailHeight = 400;
  const preferredThumbnail =
    thumbnailService &&
    thumbnailService.sizes
      .sort((a, b) => a.height - b.height)
      .find(dimensions => dimensions.height >= preferredMinThumbnailHeight);

  return (
    <IIIFViewerThumb
      onClick={clickHandler}
      isActive={isActive}
      isFocusable={isFocusable}
      className={isActive ? 'activeThumbnail' : undefined}
    >
      <IIIFViewerThumbInner>
        <ImageContainer>
          {!thumbnailLoaded && !isRestricted && (
            <LL small={true} lighten={true} />
          )}
          {isRestricted ? (
            <>
              <Padlock />
              <span className="visually-hidden">
                Thumbnail image is not available
              </span>
            </>
          ) : (
            <IIIFViewerImage
              highlightImage={highlightImage}
              width={preferredThumbnail ? preferredThumbnail.width : 30}
              src={
                urlTemplate
                  ? urlTemplate({
                      size: `${
                        preferredThumbnail
                          ? `${preferredThumbnail.width},`
                          : 'max'
                      }`,
                    })
                  : undefined
              }
              srcSet=""
              sizes={`${preferredThumbnail ? preferredThumbnail.width : 30}px`}
              alt=""
              loadHandler={() => {
                setThumbnailLoaded(true);
              }}
            />
          )}
        </ImageContainer>
        <div>
          <>
            <Space v={{ size: 's', properties: ['margin-bottom'] }}>
              <IIIFViewerThumbNumber isActive={isActive}>
                {canvas.label.trim() !== '-' && 'page'} {canvas.label}
              </IIIFViewerThumbNumber>
            </Space>
            <div>
              <IIIFViewerThumbNumber isActive={isActive}>
                <span style={{ fontSize: '11px' }}>{`${thumbNumber}`}</span>
              </IIIFViewerThumbNumber>
            </div>
          </>
        </div>
      </IIIFViewerThumbInner>
    </IIIFViewerThumb>
  );
};

export default IIIFCanvasThumbnail;
