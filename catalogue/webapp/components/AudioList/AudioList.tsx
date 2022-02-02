import { FC } from 'react';
import { classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import { IIIFSoundElement } from '../../model/iiif';
import DownloadLink from '../DownloadLink/DownloadLink';

type Props = {
  audio: IIIFSoundElement[];
  thumbnail: any;
  transcript: any;
};

const AudioList: FC<Props> = ({ audio, thumbnail, transcript }) => {
  return (
    <div>
      {thumbnail && (
        <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
          <img src={thumbnail.id} alt="" />
        </Space>
      )}
      <ol
        className={classNames({
          'no-margin no-padding plain-list': true,
        })}
      >
        {audio.map((a, index) => (
          <Space
            as="li"
            key={a.id}
            v={{ size: 'l', properties: ['margin-bottom'] }}
            aria-label={audio.length > 1 ? (index + 1).toString() : undefined}
          >
            <span
              className={classNames({
                'flex flex--v-center': true,
              })}
            >
              {audio.length > 1 && (
                <Space
                  aria-hidden="true"
                  h={{ size: 's', properties: ['margin-right'] }}
                >
                  {index + 1}
                </Space>
              )}
              <AudioPlayer audio={a} />
            </span>
          </Space>
        ))}
      </ol>
      {transcript && (
        <Space v={{ size: 's', properties: ['margin-top'] }}>
          <DownloadLink
            href={transcript.id}
            linkText={`Transcript of audio`}
            format={'PDF'}
            trackingEvent={{
              category: 'Download link',
              action: `followaudio annotation link`,
              label: transcript.id,
            }}
            mimeType={'application/pdf'}
            trackingTags={['annotation']}
          />
        </Space>
      )}
    </div>
  );
};

export default AudioList;
