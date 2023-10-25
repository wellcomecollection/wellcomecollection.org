import { ReactElement, FunctionComponent } from 'react';
import Space from '@weco/common/views/components/styled/Space';
import DownloadLink from '@weco/content/components/DownloadLink/DownloadLink';
import { Video } from '@weco/content/services/iiif/types/manifest/v3';

type Props = {
  media: Video;
};

function getMediaFormatString(format: string | undefined) {
  switch (format) {
    case 'audio/mp3':
      return ' audio';
    case 'video/mp4':
      return ' video';
    default:
      return '';
  }
}

const MediaAnnotations: FunctionComponent<Props> = ({
  media,
}: Props): ReactElement => {
  const typeString = getMediaFormatString(media.format);

  return (
    <>
      {media.annotations &&
        media.annotations.format === 'application/pdf' &&
        media.annotations.id && (
          <Space $v={{ size: 's', properties: ['margin-top'] }}>
            <DownloadLink
              href={media.annotations.id}
              linkText={`Transcript of ${typeString}`}
              format="PDF"
              trackingEvent={{
                category: 'Download link',
                action: `follow${typeString} annotation link`,
                label: media['@id'],
              }}
              mimeType={media.annotations.format}
              trackingTags={['annotation']}
            />
          </Space>
        )}
    </>
  );
};

export default MediaAnnotations;
