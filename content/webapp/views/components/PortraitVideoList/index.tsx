import * as prismic from '@prismicio/client';
import { FunctionComponent } from 'react';

import { ImageType } from '@weco/common/model/image';
import { gridSize12 } from '@weco/common/views/components/Layout';
import PortraitVideoEmbed from '@weco/common/views/components/PortraitVideoEmbed';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';
import { ListItem } from '@weco/content/views/components/ThemeCardsList/ThemeCardsList.styles';

import { Title } from './PortraitVideoList.styles';

export type PortraitVideoItem = {
  embedUrl: string;
  posterImage?: ImageType;
  duration?: string;
  title?: string;
  transcript?: prismic.RichTextField;
};

type Props = {
  title?: string;
  items: PortraitVideoItem[];
  gridSizes?: SizeMap;
  useShim?: boolean;
};

const PortraitVideoList: FunctionComponent<Props> = ({
  title,
  items,
  gridSizes = gridSize12(),
  useShim,
}) => {
  if (items.length === 0) return null;

  return (
    <div data-component="portrait-video-list">
      <ScrollContainer
        gridSizes={gridSizes}
        useShim={useShim}
        CopyContent={title ? <Title>{title}</Title> : undefined}
      >
        {items.map((item, i) => (
          <ListItem key={i} $usesShim={useShim} $cols={3}>
            <PortraitVideoEmbed {...item} />
          </ListItem>
        ))}
      </ScrollContainer>
    </div>
  );
};

export default PortraitVideoList;
