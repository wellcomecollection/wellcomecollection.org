import {
  ChoiceBody,
  ContentResource,
  InternationalString,
} from '@iiif/presentation-3';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { unavailableContentMessage } from '@weco/common/data/microcopy';
import { information } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import Icon from '@weco/common/views/components/Icon/Icon';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { useUser } from '@weco/common/views/components/UserProvider/UserProvider';
import AudioPlayer from '@weco/content/components/AudioPlayer/AudioPlayer';
import BetaMessage from '@weco/content/components/BetaMessage/BetaMessage';
import ImageViewer from '@weco/content/components/IIIFViewer/ImageViewer';
import VideoPlayer from '@weco/content/components/VideoPlayer/VideoPlayer';
import VideoTranscript from '@weco/content/components/VideoTranscript/VideoTranscript';
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
  width: 90vw;
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
> = ({ canvas, item, placeholderId, i, RenderItem, exclude }) => {
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
            canvas={canvas}
            placeholderId={placeholderId}
            i={i}
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
  placeholderId: string | undefined;
  i: number;
  exclude: (ContentResource['type'] | 'Audio' | ChoiceBody['type'])[]; // Allows us to prevent specific types being rendered
  setImageRect?: (v: DOMRect) => void;
  setImageContainerRect?: (v: DOMRect) => void;
};

const PublicRestrictedMessage: FunctionComponent<{
  canvas: TransformedCanvas;
  i: number;
}> = ({ canvas, i }) => {
  return (
    <div className="audio">
      <Space
        className={font('intb', 5)}
        $v={{ size: 'm', properties: ['margin-bottom'] }}
      >
        {(canvas.label !== '-' && canvas.label) || `${i + 1}`}
      </Space>
      <p className={font('intr', 5)}>Access to this item is restricted.</p>
    </div>
  );
};

const StaffRestrictedMessage: FunctionComponent = () => {
  return (
    <p className={font('intr', 5)} style={{ display: 'inline-flex' }}>
      <IconContainer>
        <Icon icon={information} />
      </IconContainer>
      <span className={font('intb', 5)}>Restricted item:</span> &nbsp;Only staff
      with the right permission can access this item online.
    </p>
  );
};
// This component will be useful for the IIIFViewer if we want to make that render video, audio, pdfs and Born Digital files in addition to images.
// Currently it is used on the work page to render Sound or Video
// and on the /items page to render Sound, Video and Text (i.e. PDF)
const IIIFItem: FunctionComponent<ItemProps> = ({
  canvas,
  item,
  placeholderId,
  i,
  exclude,
  setImageRect,
  setImageContainerRect,
}) => {
  const { userIsStaffWithRestricted } = useUser();
  const isRestricted = isItemRestricted(item);
  const shouldShowItem = isItemRestricted(item) && !userIsStaffWithRestricted;
  switch (true) {
    case item.type === 'Choice' && !exclude.includes('Choice'):
      return (
        <Choice
          key={item.id}
          item={item}
          canvas={canvas}
          placeholderId={placeholderId}
          i={i}
          RenderItem={IIIFItem}
          exclude={exclude}
          setImageRect={setImageRect}
          setImageContainerRect={setImageContainerRect}
        />
      );
    case ((item.type === 'Sound' && !exclude.includes('Sound')) ||
      (item.type === 'Audio' && !exclude.includes('Audio'))) &&
      Boolean(item.id):
      return (
        <AudioPlayer
          audioFile={item.id || ''}
          title={(canvas.label !== '-' && canvas.label) || `${i + 1}`}
        />
      );
    case item.type === 'Video' && !exclude.includes('Video'):
      return (
        <div className="video">
          <VideoPlayer
            placeholderId={placeholderId}
            video={item}
            showDownloadOptions={true}
          />
          <VideoTranscript supplementing={canvas.supplementing} />
        </div>
      );
    case item.type === 'Text' && !exclude.includes('Text'):
      if ('label' in item) {
        const itemLabel = item.label
          ? getLabelString(item.label as InternationalString)
          : '';
        return (
          <IframePdfViewer
            as="iframe"
            title={`PDF: ${itemLabel}`}
            src={item.id}
          />
        );
      } else {
        return <IframePdfViewer as="iframe" title="PDF" src={item.id} />;
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
