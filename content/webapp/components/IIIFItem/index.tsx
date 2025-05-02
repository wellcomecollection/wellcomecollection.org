import {
  ChoiceBody,
  ContentResource,
  InternationalString,
} from '@iiif/presentation-3';
import { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  restrictedItemMessage,
  unavailableContentMessage,
} from '@weco/common/data/microcopy';
import { information } from '@weco/common/icons';
import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import Icon from '@weco/common/views/components/Icon';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { useUser } from '@weco/common/views/components/UserProvider';
import AudioPlayer from '@weco/content/components/AudioPlayer';
import AudioPlayerNew from '@weco/content/components/AudioPlayerNew';
import BetaMessage from '@weco/content/components/BetaMessage';
import ImageViewer from '@weco/content/components/IIIFViewer/ImageViewer';
import VideoPlayer from '@weco/content/components/VideoPlayer';
import VideoTranscript from '@weco/content/components/VideoTranscript';
import { fetchCanvasOcr } from '@weco/content/services/iiif/fetch/canvasOcr';
import { transformCanvasOcr } from '@weco/content/services/iiif/transformers/canvasOcr';
import { missingAltTextMessage } from '@weco/content/services/wellcome/catalogue/works';
import {
  CustomContentResource,
  TransformedCanvas,
} from '@weco/content/types/manifest';
import { convertRequestUriToInfoUri } from '@weco/content/utils/iiif/convert-iiif-uri';
import {
  getImageServiceFromItem,
  getLabelString,
  isItemRestricted,
} from '@weco/content/utils/iiif/v3';

const IframePdfViewer = styled(Space)`
  width: 100%;
  height: 90vh;
  display: block;
  border: 0;
  margin-left: auto;
  margin-right: auto;
`;

const Outline = styled(Space).attrs({
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})<{ $border?: boolean }>`
  ${props =>
    props.$border
      ? `border: 1px solid; border-color:  ${props.theme.color('neutral.400')}`
      : ``}
`;

const IconContainer = styled(Space).attrs({
  $h: { size: 's', properties: ['margin-right'] },
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
};

const PublicRestrictedMessage: FunctionComponent<{
  canvas: TransformedCanvas;
  titleOverride?: string;
}> = ({ canvas, titleOverride }) => {
  return (
    <div className="audio">
      <Space
        className={font('intb', 5)}
        $v={{ size: 'm', properties: ['margin-bottom'] }}
      >
        {(canvas.label !== '-' && canvas.label) || `${titleOverride}`}
      </Space>
      <p className={font('intr', 5)}>{restrictedItemMessage}</p>
    </div>
  );
};

const StaffRestrictedMessage: FunctionComponent = () => {
  return (
    <p className={font('intr', 5)} style={{ display: 'flex' }}>
      <IconContainer>
        <Icon icon={information} />
      </IconContainer>
      <span className={font('intb', 5)}>Restricted item:</span> &nbsp;Only staff
      with the right permission can access this item online.
    </p>
  );
};

const Wrapper: FunctionComponent<{
  shouldShowItem: boolean;
  className: string;
  titleOverride?: string;
  canvas: TransformedCanvas;
  isRestricted: boolean;
  children: ReactNode | undefined;
}> = ({
  shouldShowItem,
  className,
  titleOverride,
  canvas,
  isRestricted,
  children,
}) => {
  if (shouldShowItem) {
    return (
      <Outline className="item-wrapper">
        <PublicRestrictedMessage
          canvas={canvas}
          titleOverride={titleOverride}
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

// This component will be useful for the IIIFViewer if we want to make that render video, audio, pdfs and Born Digital files in addition to images.
// Currently it is used on the work page to render Sound or Video
// and on the /items page to render Sound, Video and Text (i.e. PDF)
const IIIFItem: FunctionComponent<ItemProps> = ({
  canvas,
  item,
  placeholderId,
  titleOverride,
  i,
  exclude,
  setImageRect,
  setImageContainerRect,
}) => {
  const { userIsStaffWithRestricted } = useUser();
  const isRestricted = isItemRestricted(item);
  const shouldShowItem = isItemRestricted(item) && !userIsStaffWithRestricted;
  const { audioPlayer, extendedViewer } = useToggles();

  // N.B. Restricted images are handled differently from restricted audio/video and text.
  // The isItemRestricted function doesn't account for restricted images.
  // Instead there is a hasRestrictedImage property on the TransformedCanvas which is used by
  // the ItemRenderer in MainViewer to decide whether or not to display the image.
  // This is ok as we only ever have one image to a canvas.
  // Theoretically, a canvas could contain more than one image (e.g. a painting and an x-ray of the painting)
  // Therefore we may want to handle images here in the same way as everything else.
  // Doing so would also make things simpler to understand.
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
        />
      );

    case ((item.type === 'Sound' && !exclude.includes('Sound')) ||
      (item.type === 'Audio' && !exclude.includes('Audio'))) &&
      !!item.id:
      return (
        <Wrapper
          shouldShowItem={shouldShowItem}
          className="item-wrapper"
          titleOverride={titleOverride}
          canvas={canvas}
          isRestricted={isRestricted}
        >
          {audioPlayer && extendedViewer ? (
            <AudioPlayerNew
              isDark
              audioFile={item.id}
              title={(canvas.label !== '-' && canvas.label) || titleOverride}
            />
          ) : (
            <AudioPlayer
              audioFile={item.id}
              title={
                (canvas.label !== '-' && canvas.label) || titleOverride || ''
              }
            />
          )}
        </Wrapper>
      );

    case item.type === 'Video' && !exclude.includes('Video'):
      return (
        <Wrapper
          shouldShowItem={shouldShowItem}
          className="item-wrapper"
          titleOverride={titleOverride}
          canvas={canvas}
          isRestricted={isRestricted}
        >
          <>
            <VideoPlayer
              placeholderId={placeholderId}
              video={item}
              showDownloadOptions={true}
            />
            <VideoTranscript supplementing={canvas.supplementing} />
          </>
        </Wrapper>
      );

    case item.type === 'Text' && !exclude.includes('Text'):
      if ('label' in item) {
        const itemLabel = item.label
          ? getLabelString(item.label as InternationalString)
          : '';
        return (
          <Wrapper
            shouldShowItem={shouldShowItem}
            className="pdf-wrapper"
            titleOverride={titleOverride}
            canvas={canvas}
            isRestricted={isRestricted}
          >
            <IframePdfViewer
              as="iframe"
              title={`PDF: ${itemLabel}`}
              src={item.id}
            />
          </Wrapper>
        );
      } else {
        return (
          <Wrapper
            shouldShowItem={shouldShowItem}
            className="pdf-wrapper"
            titleOverride={titleOverride}
            canvas={canvas}
            isRestricted={isRestricted}
          >
            <IframePdfViewer as="iframe" title="PDF" src={item.id} />
          </Wrapper>
        );
      }

    case item.type === 'Image' && !exclude.includes('Image'):
      return (
        <IIIFImage
          index={i}
          item={item}
          canvas={canvas}
          setImageRect={setImageRect}
          setImageContainerRect={setImageContainerRect}
        />
      );

    default: // There are other types we don't do anything with at present, e.g. Dataset
      if (!exclude.includes(item.type)) {
        // If the item hasn't been purposefully excluded then we should show a message
        return (
          <ContaineredLayout gridSizes={gridSize12()}>
            <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
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
