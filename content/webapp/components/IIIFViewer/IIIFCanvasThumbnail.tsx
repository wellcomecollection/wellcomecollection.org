import { FunctionComponent, useState } from 'react';
import { TransformedCanvas } from '../../types/manifest';
import { font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import IIIFViewerImage from './IIIFViewerImage';
import LL from '@weco/common/views/components/styled/LL';
import Padlock from './Padlock';
import Space from '@weco/common/views/components/styled/Space';

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

type IIIFCanvasThumbnailProps = {
  canvas: TransformedCanvas;
  thumbNumber: number;
  highlightImage?: boolean;
};

const IIIFCanvasThumbnail: FunctionComponent<IIIFCanvasThumbnailProps> = ({
  canvas,
  thumbNumber,
  highlightImage,
}: IIIFCanvasThumbnailProps) => {
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const isRestricted = canvas.hasRestrictedImage;

  return (
    <IIIFViewerThumb>
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
              width={canvas?.thumbnailImage?.width || 30}
              src={canvas?.thumbnailImage?.url}
              srcSet=""
              sizes={`${canvas?.thumbnailImage?.width || 30}px`}
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
              <IIIFViewerThumbNumber>
                {canvas.label?.trim() !== '-' && 'page'} {canvas.label}
              </IIIFViewerThumbNumber>
            </Space>
            <div>
              <IIIFViewerThumbNumber>
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
