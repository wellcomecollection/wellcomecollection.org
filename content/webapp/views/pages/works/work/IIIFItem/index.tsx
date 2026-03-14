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
import { information } from '@weco/common/icons';
import { LinkProps } from '@weco/common/model/link-props';
import { font } from '@weco/common/utils/classnames';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import Icon from '@weco/common/views/components/Icon';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
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

import IIIFItemDownload from './IIIFItem.Download';
import VideoTranscript from './IIIFItem.VideoTranscript';

const MessageContainer = styled.div`
  min-width: 360px;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid ${props => props.theme.color('neutral.600')};
  height: 80%;
  padding: 10%;
`;

const Outline = styled(Space).attrs({
  $v: {
    size: 'md',
    properties: ['margin-top', 'margin-bottom'],
  },
  $h: { size: 'lg', properties: ['margin-left', 'margin-right'] },
})<{ $border?: boolean }>`
  position: relative;
  padding-left: ${props => props.theme.spacingUnits['400']};
  padding-right: ${props => props.theme.spacingUnits['400']};
  ${props =>
    props.$border
      ? `border: 1px solid; border-color:  ${props.theme.color('neutral.400')}`
      : ``};
  height: 100%;
`;

const IconContainer = styled(Space).attrs({
  $h: { size: 'xs', properties: ['margin-right'] },
})`
  .icon {
    position: relative;
    top: 1px;
    border-radius: 50%;
    border: 2px solid;
    width: 22px;
    height: 22px;
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
  setImageRect?: (v: DOMRect) => void;
  setImageContainerRect?: (v: DOMRect) => void;
}> = ({ index, item, canvas, setImageRect, setImageContainerRect }) => {
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
          <p
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

const StaffRestrictedMessage: FunctionComponent = () => {
  return (
    <p
      className={font('sans', -1)}
      style={{ display: 'flex', marginTop: '10px' }}
    >
      <IconContainer>
        <Icon icon={information} />
      </IconContainer>
      <span className={font('sans-bold', -1)}>Restricted item:</span> &nbsp;Only
      staff with the right permission can access this item online.
    </p>
  );
};

const IIIFItemWrapper: FunctionComponent<{
  shouldShowItem: boolean;
  className: string;
  isRestricted: boolean;
  externalAccessService?: TransformedAuthService;
  children: ReactNode | undefined;
  containerRef?: RefObject<HTMLDivElement | null>;
}> = ({
  shouldShowItem,
  className,
  isRestricted,
  externalAccessService,
  children,
  containerRef,
}) => {
  if (shouldShowItem) {
    return (
      <Outline className="item-wrapper" ref={containerRef}>
        <PublicRestrictedMessage
          externalAccessService={externalAccessService}
        />
      </Outline>
    );
  } else {
    return (
      <Outline $border={isRestricted} className={className} ref={containerRef}>
        {isRestricted && <StaffRestrictedMessage />}
        {children}
      </Outline>
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
  externalAccessService?: TransformedAuthService;
  children: ReactNode | undefined;
  index: number;
}> = ({
  shouldShowItem,
  className,
  isRestricted,
  externalAccessService,
  children,
  index,
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
      externalAccessService={externalAccessService}
      containerRef={ref}
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
}) => {
  const { userIsStaffWithRestricted } = useUserContext();
  const isRestricted = hasRestrictedItem(canvas);
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
        />
      );

    case ((item.type === 'Sound' && !exclude.includes('Sound')) ||
      (item.type === 'Audio' && !exclude.includes('Audio'))) &&
      !!item.id:
      return (
        <IIIFItemWrapper
          shouldShowItem={shouldShowItem}
          className="item-wrapper"
          isRestricted={isRestricted}
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
          className="item-wrapper"
          isRestricted={isRestricted}
          externalAccessService={adjustedExternalAccessService}
        >
          <>
            <VideoPlayer
              placeholderId={placeholderId}
              video={item}
              showDownloadOptions={true}
            />
            <VideoTranscript
              supplementing={canvas.supplementing}
              isDark={isDark}
            />
          </>
        </IIIFItemWrapper>
      );

    case item.type === 'Text' && item.id && !exclude.includes('Text'):
      return (
        <IIIFItemWrapper
          shouldShowItem={shouldShowItem}
          className="pdf-wrapper"
          isRestricted={isRestricted}
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
                    className="item-wrapper"
                    isRestricted={isRestricted}
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
            setImageRect={setImageRect}
            setImageContainerRect={setImageContainerRect}
          />
        );
        if (shouldScrollToUpdateUrl) {
          return (
            <IIIFItemWrapperWithObserver
              shouldShowItem={shouldShowItem}
              className="item-wrapper"
              isRestricted={isRestricted}
              externalAccessService={adjustedExternalAccessService}
              index={i}
            >
              {imageContent}
            </IIIFItemWrapperWithObserver>
          );
        }
        return (
          <IIIFItemWrapper
            shouldShowItem={shouldShowItem}
            className="item-wrapper"
            isRestricted={isRestricted}
            externalAccessService={adjustedExternalAccessService}
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
