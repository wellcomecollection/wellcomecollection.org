import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { PortraitVideoListSlice as RawPortraitVideoListSlice } from '@weco/common/prismicio-types';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformVideoEmbed } from '@weco/content/services/prismic/transformers/embeds';
import { SliceZoneContext } from '@weco/content/views/components/Body';
import PortraitVideoList from '@weco/content/views/components/PortraitVideoList';

type PortraitVideoListSliceProps = SliceComponentProps<
  RawPortraitVideoListSlice,
  SliceZoneContext
>;

const PortraitVideoListSlice: FunctionComponent<
  PortraitVideoListSliceProps
> = ({ slice, context }) => {
  const items = slice.items.flatMap(item => {
    const embed = transformVideoEmbed(item.embed);
    if (!embed) return [];
    return [
      {
        embedUrl: embed.embedUrl,
        videoProvider: embed.videoProvider,
        posterImage:
          transformImage(item.poster_image) ??
          (embed.thumbnailUrl && embed.thumbnailWidth && embed.thumbnailHeight
            ? {
                contentUrl: embed.thumbnailUrl,
                width: embed.thumbnailWidth,
                height: embed.thumbnailHeight,
                alt: null,
              }
            : undefined),
        duration: item.duration ?? undefined,
        title: item.title || embed.title || undefined,
        transcript: item.transcript,
      },
    ];
  });

  if (items.length === 0) return null;

  return (
    <SpacingComponent $sliceType={slice.slice_type}>
      <PortraitVideoList
        title={slice.primary.title ?? undefined}
        items={items}
        gridSizes={context.gridSizes}
        useShim={!context.hasNoShim}
      />
    </SpacingComponent>
  );
};

export default PortraitVideoListSlice;
