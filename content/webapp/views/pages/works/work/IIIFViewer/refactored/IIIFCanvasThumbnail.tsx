import { IIIFExternalWebResource } from '@iiif/presentation-3';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { audio, file, pdf, video } from '@weco/common/icons';
import { typography } from '@weco/common/utils/classnames';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import Icon from '@weco/common/views/components/Icon';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import useIIIFProbeService, {
  invalidateProbe,
} from '@weco/content/hooks/useIIIFProbeService';
import { IIIFItemProps, TransformedCanvas } from '@weco/content/types/manifest';
import {
  hasRestrictedItem,
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

const IconWrapper = styled.span`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ThumbnailFailedMessage = styled.span.attrs({
  className: typography('body', 'sm', 'regular'),
})`
  display: block;
  text-align: center;
  color: ${props => props.theme.color('white')};
`;

const IIIFViewerThumbNumber = styled.span.attrs({
  className: typography('body', 'sm', 'strong'),
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

function getPlaceholderIcon(
  itemType: string | undefined,
  canvas: TransformedCanvas
) {
  if (itemType === 'Sound') return audio;
  if (itemType === 'Video') return video;
  if (isPDFCanvas(canvas)) return pdf;
  return file;
}

type IIIFCanvasThumbnailProps = {
  canvas: TransformedCanvas;
  thumbNumber: number;
  isHighlighted?: boolean;
  placeholderId?: string;
  errorHandler?: () => void | Promise<void>;
  // Whether this thumbnail is actually visible to the user right now.
  // Defaults to true for the always-visible thumbnail strip; GridViewer's
  // cells pass its own `gridVisible` here, since react-window keeps many
  // off-screen cells mounted (it virtualizes by the container's layout
  // size, not by whether the container itself is on-screen) — probing each
  // one's auth cookie before the grid is ever opened would be a lot of
  // wasted requests for content the user isn't looking at yet.
  active?: boolean;
};

const IIIFCanvasThumbnail: FunctionComponent<IIIFCanvasThumbnailProps> = ({
  canvas,
  thumbNumber,
  isHighlighted,
  placeholderId,
  errorHandler,
  active = true,
}: IIIFCanvasThumbnailProps) => {
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const { userIsStaffWithRestricted } = useUserContext();

  const isRestricted = hasRestrictedItem(canvas);
  const probeStatus = useIIIFProbeService(
    active && isRestricted ? canvas : undefined
  );
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
  const isThumbnailSrcPlaceholder =
    thumbnailSrc?.includes('/born-digital/placeholder-thumb/') || false;
  const shouldShowIconPlaceholder = !thumbnailSrc || isThumbnailSrcPlaceholder;

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

          {(!isRestricted || userIsStaffWithRestricted) && (
            <>
              {!shouldShowIconPlaceholder ? (
                probeStatus === 'failed' ? (
                  <ThumbnailFailedMessage>
                    Couldn&rsquo;t load this thumbnail
                  </ThumbnailFailedMessage>
                ) : (
                  <>
                    {(!thumbnailLoaded || probeStatus === 'probing') && (
                      <LL $small $lighten />
                    )}

                    {probeStatus === 'ok' && (
                      <IIIFViewerImage
                        width={canvas?.thumbnailImage?.width || 30}
                        src={thumbnailSrc}
                        srcSet=""
                        sizes={`${canvas?.thumbnailImage?.width || 30}px`}
                        alt=""
                        loadHandler={() => {
                          setThumbnailLoaded(true);
                        }}
                        isHighlighted={isHighlighted}
                        isRestricted={isRestricted}
                        errorHandler={
                          isRestricted
                            ? () => {
                                errorHandler?.();
                                invalidateProbe(canvas.id);
                              }
                            : undefined
                        }
                      />
                    )}
                  </>
                )
              ) : (
                <IconWrapper>
                  <Icon
                    icon={getPlaceholderIcon(itemType, canvas)}
                    iconColor="white"
                    sizeOverride="width: 53px; height: 53px;"
                  />
                </IconWrapper>
              )}
            </>
          )}
        </ImageContainer>

        <div>
          <Space $v={{ size: 'xs', properties: ['margin-bottom'] }}>
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
