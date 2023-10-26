import { FunctionComponent } from 'react';
import Space from '@weco/common/views/components/styled/Space';
import AudioPlayer from '@weco/content/components/AudioPlayer/AudioPlayer';
import DownloadLink from '@weco/content/components/DownloadLink/DownloadLink';
import { IIIFExternalWebResource, ContentResource } from '@iiif/presentation-3';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import PlainList from '@weco/common/views/components/styled/PlainList';

type Props = {
  items: {
    sound: IIIFExternalWebResource;
    title?: string;
  }[];
  thumbnail?: ContentResource;
  transcript?: ContentResource;
  workTitle: string;
};

const AudioList: FunctionComponent<Props> = ({
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
      <PlainList as="ol">
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
      </PlainList>
      {isNotUndefined(transcript) && isNotUndefined(transcript.id) && (
        <Space v={{ size: 's', properties: ['margin-top'] }}>
          <DownloadLink
            href={transcript.id}
            linkText={`Transcript of ${workTitle} audio`}
            format="PDF"
            mimeType="application/pdf"
            trackingTags={['annotation']}
          />
        </Space>
      )}
    </div>
  );
};

export default AudioList;
