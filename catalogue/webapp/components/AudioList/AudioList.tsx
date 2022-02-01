import { FC } from 'react';
import { classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import { IIIFMediaElement } from '../../model/iiif';

type Props = {
  audio: IIIFMediaElement[];
};

const AudioList: FC<Props> = ({ audio }) => {
  return (
    <ol
      className={classNames({
        'no-margin no-padding plain-list': true,
      })}
    >
      {audio.map((a, index) => (
        <Space
          as="li"
          key={a['@id']}
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
  );
};

export default AudioList;
