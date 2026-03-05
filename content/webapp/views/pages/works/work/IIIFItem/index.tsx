import {
  ChoiceBody,
  ContentResource,
  InternationalString,
} from '@iiif/presentation-3';
import { FunctionComponent, ReactNode, useEffect, useState } from 'react';
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
import { getFileLabel } from '@weco/content/utils/works';
import AudioPlayer from '@weco/content/views/components/AudioPlayer';
import BetaMessage from '@weco/content/views/components/BetaMessage';
import VideoPlayer from '@weco/content/views/components/VideoPlayer';
import IIIFItemPdf from '@weco/content/views/pages/works/work/IIIFItem/IIIFItem.Pdf';
import ImageViewer from '@weco/content/views/pages/works/work/IIIFViewer/ImageViewer';

import IIIFItemDownload from './IIIFItem.Download';
import VideoTranscript from './IIIFItem.VideoTranscript';

const MessageContainer = styled.div`
  min-width: 360px;
  max-width: 60%;
  margin: 0 auto;
  border: 1px solid ${props => props.theme.color('neutral.600')};
  height: 80%;
  margin-top: 50%;
  transform: translateY(-50%);
  padding: 10%;
`;

const Outline = styled(Space).attrs({
  $v: { size: 'sm', properties: ['padding-top', 'padding-bottom'] },
})<{ $border?: boolean }>`
  padding-left: ${props => props.theme.spacingUnits['400']};
  padding-right: ${props => props.theme.spacingUnits['400']};
  ${props =>
    props.$border
      ? `border: 1px solid; border-color:  ${props.theme.color('neutral.400')}`
      : ``}
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
  externalAccessService?: { label?: string; description?: string };
};

//TODO should the is be the externalAccess service, which I think is manifest level, check, or message of something from the item
const PublicRestrictedMessage: FunctionComponent<{
  externalAccessService?: { label?: string; description?: string };
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
        <p className={font('sans', -1)}>{restrictedItemMessage}</p>
      </div>
    </MessageContainer>
  );
};

const StaffRestrictedMessage: FunctionComponent = () => {
  return (
    <p className={font('sans', -1)} style={{ display: 'flex' }}>
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
  externalAccessService?: { label?: string; description?: string };
  children: ReactNode | undefined;
}> = ({
  shouldShowItem,
  className,
  isRestricted,
  externalAccessService,
  children,
}) => {
  if (shouldShowItem) {
    return (
      <Outline className="item-wrapper">
        <PublicRestrictedMessage
          externalAccessService={externalAccessService}
        />
      </Outline>
    );
  } else {
    return (
      <Outline $border={isRestricted} className={className}>
        {isRestricted && <StaffRestrictedMessage />}
        {children}
      </Outline>
    );
  }
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
}) => {
  const { userIsStaffWithRestricted } = useUserContext();
  const isRestricted = hasRestrictedItem(canvas);

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
          externalAccessService={externalAccessService}
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
          externalAccessService={externalAccessService}
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
          externalAccessService={externalAccessService}
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
          externalAccessService={externalAccessService}
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
                    externalAccessService={externalAccessService}
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
        return (
          <IIIFItemWrapper
            shouldShowItem={shouldShowItem}
            className="item-wrapper"
            isRestricted={isRestricted}
            externalAccessService={externalAccessService}
          >
            <IIIFImage
              index={i}
              item={item}
              canvas={canvas}
              setImageRect={setImageRect}
              setImageContainerRect={setImageContainerRect}
            />
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
