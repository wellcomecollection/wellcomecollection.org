import { FC } from 'react';
import { classNames, font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import { IIIFImageV3, IIIFMediaElementV3, IIIFTextV3 } from '../../model/iiif';
import DownloadLink from '../DownloadLink/DownloadLink';

type Props = {
  items: {
    sound: IIIFMediaElementV3;
    title?: string;
  }[];
  thumbnail?: IIIFImageV3;
  transcript?: IIIFTextV3;
  audioTitle?: string;
  workTitle: string;
};

const AudioList: FC<Props> = ({
  items,
  // thumbnail,
  transcript,
  workTitle,
}) => {
  return (
    <div>
      {/* TODO: add thumbnail once placeholders have been removed from manifests */}
      {/* {thumbnail && (
        <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
          <img src={thumbnail.id} alt="" />
        </Space>
      )} */}
      <ol
        className={classNames({
          'no-margin no-padding plain-list': true,
        })}
      >
        {items.map((item, index) => (
          <Space
            as="li"
            key={item.sound.id}
            v={{ size: 'l', properties: ['margin-bottom'] }}
            aria-label={items.length > 1 ? (index + 1).toString() : undefined}
          >
            {item.title && <h3 className={font('hnb', 5)}>{item.title}</h3>}
            <span
              className={classNames({
                'flex flex--v-center': true,
              })}
            >
              {items.length > 1 && (
                <Space
                  aria-hidden="true"
                  h={{ size: 's', properties: ['margin-right'] }}
                >
                  {index + 1}
                </Space>
              )}
              <AudioPlayer audio={item.sound} />
            </span>
          </Space>
        ))}
      </ol>
      {transcript && (
        <Space v={{ size: 's', properties: ['margin-top'] }}>
          <DownloadLink
            href={transcript.id}
            linkText={`Transcript of ${workTitle} audio`}
            format={'PDF'}
            trackingEvent={{
              category: 'Download link',
              action: `follow audio annotation link`,
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
