import { FC } from 'react';
import { classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { IIIFMediaElement } from '../../model/iiif';
import MediaAnnotations from '../MediaAnnotations/MediaAnnotations';
import AudioPlayer from '@weco/common/views/components/AudioPlayer/AudioPlayer';

type Props = {
  items: IIIFMediaElement[];
};

const AudioList: FC<Props> = ({ items }) => {
  return (
    <ol
      className={classNames({
        'no-margin no-padding plain-list': true,
      })}
    >
      {items.map((item, index) => (
        <Space
          as="li"
          key={item['@id']}
          v={{ size: 'l', properties: ['margin-bottom'] }}
        >
          <AudioPlayer
            audioFile={item['@id']}
            title={(index + 1).toString()}
            idPrefix="catalogue:"
          />
          <MediaAnnotations media={item} />
        </Space>
      ))}
    </ol>
  );
};

export default AudioList;
