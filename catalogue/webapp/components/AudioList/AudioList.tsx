import { FC } from 'react';
import { classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import { IIIFMediaElement } from '../../model/iiif';

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
          aria-label={items.length > 1 ? (index + 1).toString() : undefined}
        >
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
            <AudioPlayer audio={item} />
          </span>
        </Space>
      ))}
    </ol>
  );
};

export default AudioList;
