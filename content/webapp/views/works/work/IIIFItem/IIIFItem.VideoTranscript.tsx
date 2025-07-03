import {
  ChoiceBody,
  ContentResource,
  EmbeddedResource,
  ExternalWebResource,
} from '@iiif/presentation-3';
import { FunctionComponent } from 'react';

import DownloadLink from '@weco/common/views/components/DownloadLink';
import Space from '@weco/common/views/components/styled/Space';
import { getFormatString } from '@weco/content/utils/iiif/v3';

type Props = {
  supplementing: (ContentResource | ChoiceBody)[];
  isDark?: boolean;
};

const VideoTranscript: FunctionComponent<Props> = ({
  supplementing,
  isDark,
}: Props) => {
  return (
    <>
      {supplementing.map(item => {
        const displayItem = (item.type === 'Choice' ? item.items[0] : item) as
          | EmbeddedResource
          | ExternalWebResource;
        if (typeof displayItem !== 'string' && displayItem.id) {
          return (
            <Space key={item.id} $v={{ size: 's', properties: ['margin-top'] }}>
              <DownloadLink
                href={displayItem.id}
                linkText="Transcript of video"
                format={getFormatString(displayItem.format)}
                mimeType={displayItem.format || ''}
                trackingTags={['annotation']}
                isDark={isDark}
              />
            </Space>
          );
        } else {
          return null;
        }
      })}
    </>
  );
};

export default VideoTranscript;
