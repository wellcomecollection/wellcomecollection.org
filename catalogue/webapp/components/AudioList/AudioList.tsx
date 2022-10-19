import { FC } from 'react';
import Space from '@weco/common/views/components/styled/Space';
import AudioPlayer from '@weco/common/views/components/AudioPlayer/AudioPlayer';
import DownloadLink from '@weco/common/views/components/DownloadLink/DownloadLink';
import { IIIFExternalWebResource, ContentResource } from '@iiif/presentation-3';
import { isNotUndefined } from '@weco/common/utils/array';

type Props = {
  items: {
    sound: IIIFExternalWebResource;
    title?: string;
  }[];
  thumbnail?: ContentResource;
  transcript?: ContentResource;
  audioTitle?: string;
  workTitle: string;
};

const AudioList: FC<Props> = ({
  items,
  // thumbnail, TODO: add thumbnail once placeholders have been removed from manifests
  transcript,
  workTitle,
}) => {
  return (
    <div>
      {/* TODO: add thumbnail once placeholders have been removed from manifests */}
      {/* {isNotUndefined(thumbnail) && isNotUndefined(thumbnail.id) && (
        <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
          <img src={thumbnail.id} alt="" />
        </Space>
      )} */}
      <ol className="no-margin no-padding plain-list">
        {items.map((item, index) => (
          <>
            {item.sound.id && (
              <Space
                as="li"
                key={item.sound.id}
                v={{ size: 'l', properties: ['margin-bottom'] }}
              >
                <AudioPlayer
                  audioFile={item.sound.id}
                  title={item.title || (items.length > 1 ? `${index + 1}` : '')}
                />
              </Space>
            )}
          </>
        ))}
      </ol>
      {isNotUndefined(transcript) && isNotUndefined(transcript.id) && (
        <Space v={{ size: 's', properties: ['margin-top'] }}>
          <DownloadLink
            href={transcript.id}
            linkText={`Transcript of ${workTitle} audio`}
            format="PDF"
            trackingEvent={{
              category: 'Download link',
              action: 'follow audio annotation link',
              label: transcript.id,
            }}
            mimeType="application/pdf"
            trackingTags={['annotation']}
          />
        </Space>
      )}
    </div>
  );
};

export default AudioList;
