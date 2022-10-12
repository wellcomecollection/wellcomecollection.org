import { ReactElement, FunctionComponent } from 'react';
import { IIIFMediaElement, IIIFAnnotationResource } from '../../model/iiif';
import { getAnnotationFromMediaElement } from '../../utils/iiif/v2';
import Space from '@weco/common/views/components/styled/Space';
import DownloadLink from '@weco/catalogue/components/DownloadLink/DownloadLink';

type Props = {
  media: IIIFMediaElement;
};

function getMediaFormatString(format) {
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
  const annotation: IIIFAnnotationResource | undefined =
    getAnnotationFromMediaElement(media);
  const typeString = getMediaFormatString(media.format);
  return (
    <>
      {annotation &&
        annotation.resource &&
        annotation.resource.format === 'application/pdf' && (
          <Space v={{ size: 's', properties: ['margin-top'] }}>
            <DownloadLink
              href={annotation.resource['@id']}
              linkText={`Transcript of ${annotation.resource.label}${typeString}`}
              format={'PDF'}
              trackingEvent={{
                category: 'Download link',
                action: `follow${typeString} annotation link`,
                label: media['@id'],
              }}
              mimeType={annotation.resource.format}
              trackingTags={['annotation']}
            />
          </Space>
        )}
    </>
  );
};

export default MediaAnnotations;
