import { useUserContext } from '@weco/common/contexts/UserContext';
import { play } from '@weco/common/icons';
import { formatDuration } from '@weco/common/utils/format-date';
import Button from '@weco/common/views/components/Buttons';
import Download from '@weco/content/views/components/Download';
import {
  DownloadOption,
  TransformedCanvas,
} from '@weco/content/types/manifest';
import {
  getCanvasPaintingItem,
  getVideoAudioDownloadOptions,
  isAudioCanvas,
} from '@weco/content/utils/iiif/v3';
import { getFileLabel } from '@weco/content/utils/works';

const getTypeAndDuration = (
  canvas: TransformedCanvas
): { type: string; duration?: string } => {
  const paintingItem = getCanvasPaintingItem(canvas);

  const duration =
    paintingItem &&
    'duration' in paintingItem &&
    typeof paintingItem.duration === 'number'
      ? formatDuration(Math.round(paintingItem.duration))
      : undefined;

  const isAudio = isAudioCanvas(paintingItem);

  return { type: isAudio ? 'Audio' : 'Video', duration };
};

const IIIFItemAudioVideoLink = ({ canvas, item, i, itemUrl, isRestricted }) => {
  const { userIsStaffWithRestricted } = useUserContext();

  const showItemToUser =
    !isRestricted || (isRestricted && userIsStaffWithRestricted);

  const index = i + 1;
  const canvasLabel = getFileLabel(canvas.label, `${item.type} ${index}`);
  const { type, duration } = getTypeAndDuration(canvas);
  const viewerQuery = index > 1 ? { canvas: index } : {};

  // Could have more than one download option
  const downloadableCanvas: DownloadOption[] | undefined =
    getVideoAudioDownloadOptions(canvas);

  return (
    <>
      <span style={{ fontSize: '1rem' }}>{canvasLabel}</span>

      {showItemToUser && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {duration && (
            <span style={{ marginRight: '1rem' }}>
              {duration} {type === 'Audio' ? 'listen' : 'watch'} time
            </span>
          )}

          {itemUrl && (
            <Button
              variant="ButtonSolidLink"
              icon={play}
              text="Play"
              link={{
                ...itemUrl,
                href: { ...itemUrl.href, query: viewerQuery },
                as: { ...itemUrl.as, query: viewerQuery },
              }}
            />
          )}

          {downloadableCanvas && (
            <Download
              ariaControlsId={`itemDownload ` + index}
              downloadOptions={downloadableCanvas}
            />
          )}
        </div>
      )}
    </>
  );
};

export default IIIFItemAudioVideoLink;
