import { FunctionComponent } from 'react';
import Caption from '@weco/common/views/components/Caption/Caption';
import * as prismicT from '@prismicio/types';

export type Props = {
  embedUrl: string;
  caption?: prismicT.RichTextField;
};

const SoundCloudEmbed: FunctionComponent<Props> = ({
  embedUrl,
  caption,
}: Props) => (
  <figure className="no-margin">
    <iframe
      width="100%"
      height="140"
      frameBorder="no"
      title="soundcloud player"
      src={embedUrl}
    />
    {caption && <Caption caption={caption} />}
  </figure>
);

export default SoundCloudEmbed;
