import {
  ChoiceBody,
  ContentResource,
  InternationalString,
} from '@iiif/presentation-3';
import Router from 'next/router';
import {
  FunctionComponent,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import { useUserContext } from '@weco/common/contexts/UserContext';
import {
  restrictedItemMessage,
  unavailableContentMessage,
} from '@weco/common/data/microcopy';
import { LinkProps } from '@weco/common/model/link-props';
import { font } from '@weco/common/utils/classnames';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import useIIIFProbeService from '@weco/content/hooks/useIIIFProbeService';
import useOnScreen from '@weco/content/hooks/useOnScreen';
import useSkipInitialEffect from '@weco/content/hooks/useSkipInitialEffect';
import { fetchCanvasOcr } from '@weco/content/services/iiif/fetch/canvasOcr';
import { transformCanvasOcr } from '@weco/content/services/iiif/transformers/canvasOcr';
import { missingAltTextMessage } from '@weco/content/services/wellcome/catalogue/works';
import {
  CustomContentResource,
  TransformedCanvas,
} from '@weco/content/types/manifest';
import { convertRequestUriToInfoUri } from '@weco/content/utils/iiif/convert-iiif-uri';
import { hasRestrictedItem } from '@weco/content/utils/iiif/v3';
import {
  getFileSize,
  getFormatString,
  getImageServiceFromItem,
  getLabelString,
} from '@weco/content/utils/iiif/v3';
import type { TransformedAuthService } from '@weco/content/utils/iiif/v3';
import { getFileLabel } from '@weco/content/utils/works';
import AudioPlayer from '@weco/content/views/components/AudioPlayer';
import BetaMessage from '@weco/content/views/components/BetaMessage';
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';
import VideoPlayer from '@weco/content/views/components/VideoPlayer';
import IIIFItemPdf from '@weco/content/views/pages/works/work/IIIFItem/IIIFItem.Pdf';
import { arrayIndexToQueryParam } from '@weco/content/views/pages/works/work/IIIFViewer';
import ImageViewer from '@weco/content/views/pages/works/work/IIIFViewer/ImageViewer';
import RestrictedItemMessage from '@weco/content/views/pages/works/work/work.RestrictedItemMessage';

import IIIFItemDownload from './IIIFItem.Download';
import VideoTranscript from './IIIFItem.VideoTranscript';

const MessageContainer = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  min-width: 300px;
  max-width: 80%;
  margin: 0 auto;
  border: 1px solid ${props => props.theme.color('neutral.600')};
  height: 80%;
  padding: 10%;
`;

const RestrictedMessage = styled.div.attrs({})`
  margin: 2em auto 0;

  p {
    margin: 0;
  }
`;

const ImageItemLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ImageViewerContainer = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
`;

const ImageViewerPositioned = styled.div`
  position: absolute;
  inset: 0;
`;

const ItemWrapper = styled(Space)<{ $isRestricted?: boolean }>`
  position: relative;
  height: 100%;

  &.audio-wrapper,
  &.video-wrapper,
  &.download-wrapper {
    max-width: 80%;
    margin: 2em auto;
    max-height: calc(100% - 4em);
  }
`;

const Choice: FunctionComponent<
  ItemProps & { RenderItem: FunctionComponent<ItemProps> }
> = ({
  canvas,
  item,
  placeholderId,
  titleOverride,
  RenderItem,
  exclude,
  i,
  itemUrl,
  isDark,
  externalAccessService,
  shouldScrollToUpdateUrl,
  showVideoTranscript,
}) => {
  // We may have multiple items, such as videos of different formats
  // but we only show the first of these currently
  if ('items' in item) {
    const firstItem = item.items[0];
    if (typeof firstItem !== 'string' && 'id' in firstItem) {
      return (
        <>
          <RenderItem
            key={firstItem.id}
            item={firstItem}
            i={i}
            canvas={canvas}
            placeholderId={placeholderId}
            titleOverride={titleOverride}
            exclude={exclude}
            itemUrl={itemUrl}
            isDark={isDark}
            externalAccessService={externalAccessService}
            shouldScrollToUpdateUrl={shouldScrollToUpdateUrl}
            showVideoTranscript={showVideoTranscript}
          />
        </>
      );
    }
  }
  return null;
};

const IIIFImage: FunctionComponent<{
  index: number;
  item: ItemProps['item'];
  canvas: TransformedCanvas;
  isRestricted?: boolean;
  setImageRect?: (v: DOMRect) => void;
  setImageContainerRect?: (v: DOMRect) => void;
}> = ({
  index,
  item,
  canvas,
  isRestricted,
  setImageRect,
  setImageContainerRect,
}) => {
  const [ocrText, setOcrText] = useState(missingAltTextMessage);
  const imageService = getImageServiceFromItem(item);
  const imageUrl = imageService?.['@id'] || '';
  const infoUrl = convertRequestUriToInfoUri(imageUrl);
  const urlTemplate = imageUrl ? iiifImageTemplate(imageUrl) : undefined;
  useEffect(() => {
    const fetchOcr = async () => {
      const ocrText = await fetchCanvasOcr(canvas);
      const ocrString = transformCanvasOcr(ocrText);
      setOcrText(ocrString || missingAltTextMessage);
    };
    fetchOcr();
  }, []);

  if (urlTemplate) {
    return (
      <ImageItemLayout>
        {isRestricted && (
          <RestrictedMessage>
            <RestrictedItemMessage />
          </RestrictedMessage>
        )}
        <ImageViewerContainer>
          <ImageViewerPositioned>
            <ImageViewer
              infoUrl={infoUrl}
              id={imageUrl}
              width={canvas.width || 0}
              height={canvas.height || 0}
              index={index}
              alt={ocrText}
              urlTemplate={urlTemplate}
              setImageRect={setImageRect}
              setImageContainerRect={setImageContainerRect}
            />
          </ImageViewerPositioned>
        </ImageViewerContainer>
      </ImageItemLayout>
    );
  } else {
    return <img src={item.id} alt={ocrText} />;
  }
};

// Some of our ContentResources can have a type of 'Audio':
// https://iiif.wellcomecollection.org/presentation/v3/b17276342
// However, the IIIF Presentation API spec only has a type of 'Sound'
// so we add 'Audio' to the type here.
export type IIIFItemProps =
  | (Omit<ContentResource, 'type'> & {
      type: ContentResource['type'] | 'Audio';
    })
  | CustomContentResource
  | ChoiceBody;
type ItemProps = {
  canvas: TransformedCanvas;
  item: IIIFItemProps;
  i: number;
  placeholderId?: string;
  titleOverride?: string;
  exclude: (ContentResource['type'] | 'Audio' | ChoiceBody['type'])[]; // Allows us to prevent specific types being rendered
  setImageRect?: (v: DOMRect) => void;
  setImageContainerRect?: (v: DOMRect) => void;
  itemUrl?: LinkProps;
  isDark?: boolean;
  externalAccessService?: TransformedAuthService;
  shouldScrollToUpdateUrl?: boolean;
  showVideoTranscript?: boolean;
};

const PublicRestrictedMessage: FunctionComponent<{
  externalAccessService?: import('@weco/content/utils/iiif/v3').TransformedAuthService;
}> = ({ externalAccessService }) => {
  return (
    <MessageContainer>
      {externalAccessService?.label && (
        <h2 className={font('sans-bold', 0)}>{externalAccessService.label}</h2>
      )}
      <div className={font('sans', -1)}>
        {externalAccessService?.description && (
          <div
            className={font('sans', -1)}
            dangerouslySetInnerHTML={{
              __html: externalAccessService.description,
            }}
          />
        )}
        {restrictedItemMessage}
      </div>
    </MessageContainer>
  );
};

const IIIFItemWrapper: FunctionComponent<{
  shouldShowItem: boolean;
  className: string;
  isRestricted: boolean;
  isProbeOk: boolean;
  externalAccessService?: TransformedAuthService;
  children: ReactNode | undefined;
  containerRef?: RefObject<HTMLDivElement | null>;
  removeRestrictedMessage?: boolean;
}> = ({
  shouldShowItem,
  className,
  isRestricted,
  isProbeOk,
  externalAccessService,
  children,
  containerRef,
  removeRestrictedMessage = false,
}) => {
  if (shouldShowItem) {
    return (
      <ItemWrapper ref={containerRef}>
        <PublicRestrictedMessage
          externalAccessService={externalAccessService}
        />
      </ItemWrapper>
    );
  } else {
    return (
      <ItemWrapper
        $isRestricted={isRestricted}
        className={className}
        ref={containerRef}
      >
        {isRestricted && !removeRestrictedMessage && (
          <RestrictedMessage>
            <RestrictedItemMessage />
          </RestrictedMessage>
        )}
        {(!isRestricted || isProbeOk) && children}
      </ItemWrapper>
    );
  }
};

// Wraps IIIFItemWrapper with an intersection observer that keeps the URL in
// sync with the visible canvas when scrolling through images in the viewer.
// Only used for the IIIFImage case because we only scroll when all items are images

const IIIFItemWrapperWithObserver: FunctionComponent<{
  shouldShowItem: boolean;
  className: string;
  isRestricted: boolean;
  isProbeOk: boolean;
  externalAccessService?: TransformedAuthService;
  children: ReactNode | undefined;
  index: number;
  removeRestrictedMessage?: boolean;
}> = ({
  shouldShowItem,
  className,
  isRestricted,
  isProbeOk,
  externalAccessService,
  children,
  index,
  removeRestrictedMessage = false,
}) => {
  const { work, mainAreaRef, query } = useItemViewerContext();
  const ref = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen({
    root: mainAreaRef?.current || undefined,
    ref,
    threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
  });

  useSkipInitialEffect(() => {
    if (isOnScreen) {
      const link = toWorksItemLink({
        workId: work.id,
        props: {
          manifest: query.manifest,
          query: query.query,
          canvas: arrayIndexToQueryParam(index),
          shouldScrollToCanvas: false,
        },
      });
      Router.replace(link.href);
    }
  }, [isOnScreen]);

  return (
    <IIIFItemWrapper
      shouldShowItem={shouldShowItem}
      className={className}
      isRestricted={isRestricted}
      isProbeOk={isProbeOk}
      externalAccessService={externalAccessService}
      containerRef={ref}
      removeRestrictedMessage={removeRestrictedMessage}
    >
      {children}
    </IIIFItemWrapper>
  );
};

const IIIFItem: FunctionComponent<ItemProps> = ({
  canvas,
  item,
  placeholderId,
  titleOverride,
  i,
  exclude,
  setImageRect,
  setImageContainerRect,
  itemUrl,
  isDark,
  externalAccessService,
  shouldScrollToUpdateUrl,
  showVideoTranscript = true,
}) => {
  const { userIsStaffWithRestricted } = useUserContext();
  const isRestricted = hasRestrictedItem(canvas);
  const isProbeOk = useIIIFProbeService(canvas);
  // Replace "image" with "item" in description if the item is not an image
  // or if it's an image but has originals, which means the image is just a placeholder for the original item
  const adjustedExternalAccessService =
    externalAccessService &&
    (item.type !== 'Image' ||
      (item.type === 'Image' && canvas.original.length > 0))
      ? {
          ...externalAccessService,
          description: externalAccessService.description
            ?.replace(/\bimage\b/gi, 'item')
            ?.replace(/\bviewed\b/gi, 'accessed'),
        }
      : externalAccessService;

  const shouldShowItem = isRestricted && !userIsStaffWithRestricted;
  const itemLabel =
    'label' in item
      ? getLabelString(item.label as InternationalString)
      : canvas.label?.trim() !== '-'
        ? canvas.label
        : undefined;
  switch (true) {
    case item.type === 'Choice' && !exclude.includes('Choice'):
      return (
        <Choice
          key={item.id}
          item={item}
          i={i}
          canvas={canvas}
          placeholderId={placeholderId}
          titleOverride={titleOverride}
          RenderItem={IIIFItem}
          exclude={exclude}
          setImageRect={setImageRect}
          setImageContainerRect={setImageContainerRect}
          itemUrl={itemUrl}
          isDark={isDark}
          externalAccessService={adjustedExternalAccessService}
          shouldScrollToUpdateUrl={shouldScrollToUpdateUrl}
          showVideoTranscript={showVideoTranscript}
        />
      );

    case ((item.type === 'Sound' && !exclude.includes('Sound')) ||
      (item.type === 'Audio' && !exclude.includes('Audio'))) &&
      !!item.id:
      return (
        <IIIFItemWrapper
          shouldShowItem={shouldShowItem}
          className="audio-wrapper"
          isRestricted={isRestricted}
          isProbeOk={isProbeOk}
          externalAccessService={adjustedExternalAccessService}
        >
          <AudioPlayer
            isDark={isDark}
            audioFile={item.id}
            title={getFileLabel(canvas.label, titleOverride) || ''}
          />
        </IIIFItemWrapper>
      );

    case item.type === 'Video' && !exclude.includes('Video'):
      return (
        <IIIFItemWrapper
          shouldShowItem={shouldShowItem}
          className="video-wrapper"
          isRestricted={isRestricted}
          isProbeOk={isProbeOk}
          externalAccessService={adjustedExternalAccessService}
        >
          <>
            <VideoPlayer
              placeholderId={placeholderId}
              video={item}
              showDownloadOptions={true}
            />
            {showVideoTranscript && (
              <VideoTranscript
                supplementing={canvas.supplementing}
                isDark={isDark}
              />
            )}
          </>
        </IIIFItemWrapper>
      );

    case item.type === 'Text' && item.id && !exclude.includes('Text'):
      return (
        <IIIFItemWrapper
          shouldShowItem={shouldShowItem}
          className="pdf-wrapper"
          isRestricted={isRestricted}
          isProbeOk={isProbeOk}
          externalAccessService={adjustedExternalAccessService}
        >
          <IIIFItemPdf
            src={item.id}
            label={itemLabel}
            fileSize={getFileSize(canvas)}
            format={'format' in item ? getFormatString(item.format) : undefined}
          />
        </IIIFItemWrapper>
      );

    case item.type === 'Image' && !exclude.includes('Image'):
      // If there are original items then the image is just a placeholder
      // for these so we show the download options for the original items
      // rather than the image itself
      if (canvas.original.length > 0) {
        return (
          <>
            {canvas.original.map(original => {
              return (
                original.id && (
                  <IIIFItemWrapper
                    shouldShowItem={shouldShowItem}
                    className="download-wrapper"
                    isRestricted={isRestricted}
                    isProbeOk={isProbeOk}
                    externalAccessService={adjustedExternalAccessService}
                  >
                    <IIIFItemDownload
                      key={original.id}
                      src={original.id}
                      label={itemLabel}
                      fileSize={getFileSize(canvas)}
                      format={
                        'format' in item
                          ? getFormatString(item.format)
                          : undefined
                      }
                      showWarning={true}
                    />
                  </IIIFItemWrapper>
                )
              );
            })}
          </>
        );
      } else {
        const imageContent = (
          <IIIFImage
            index={i}
            item={item}
            canvas={canvas}
            isRestricted={isRestricted}
            setImageRect={setImageRect}
            setImageContainerRect={setImageContainerRect}
          />
        );
        if (shouldScrollToUpdateUrl) {
          return (
            <IIIFItemWrapperWithObserver
              shouldShowItem={shouldShowItem}
              className="image-wrapper"
              isRestricted={isRestricted}
              isProbeOk={isProbeOk}
              externalAccessService={adjustedExternalAccessService}
              index={i}
              removeRestrictedMessage={true}
            >
              {imageContent}
            </IIIFItemWrapperWithObserver>
          );
        }
        return (
          <IIIFItemWrapper
            shouldShowItem={shouldShowItem}
            className="image-wrapper"
            isRestricted={isRestricted}
            isProbeOk={isProbeOk}
            externalAccessService={adjustedExternalAccessService}
            removeRestrictedMessage={true}
          >
            {imageContent}
          </IIIFItemWrapper>
        );
      }

    default: // There are other types we don't do anything with at present, e.g. Dataset
      if (!exclude.includes(item.type)) {
        // If the item hasn't been purposefully excluded then we should show a message
        return (
          <ContaineredLayout gridSizes={gridSize12()}>
            <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
              <BetaMessage message={unavailableContentMessage} />
            </Space>
          </ContaineredLayout>
        );
      } else {
        return null;
      }
  }
};

export default IIIFItem;
