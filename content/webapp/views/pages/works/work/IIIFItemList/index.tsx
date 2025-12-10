import { ChoiceBody, ContentResource } from '@iiif/presentation-3';
import { FunctionComponent } from 'react';

import { LinkProps } from '@weco/common/model/link-props';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { TransformedCanvas } from '@weco/content/types/manifest';
import { getDisplayItems } from '@weco/content/utils/iiif/v3/canvas';
import IIIFItem from '@weco/content/views/pages/works/work/IIIFItem';

type Props = {
  canvases: TransformedCanvas[] | undefined;
  exclude: (ContentResource['type'] | ChoiceBody['type'])[]; // Allows us to exclude certain types from being rendered
  placeholderId: string | undefined;
  itemUrl?: LinkProps;
};

const IIIFItemList: FunctionComponent<Props> = ({
  canvases,
  exclude,
  placeholderId,
  itemUrl,
}) => {
  if (!canvases) return null;

  return (
    <PlainList as="ol">
      {canvases.map((canvas, i) => {
        const displayItems = getDisplayItems(canvas);

        return displayItems.map(item => {
          return (
            <li key={item.id}>
              <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
                <IIIFItem
                  placeholderId={placeholderId}
                  item={item}
                  canvas={canvas}
                  i={i}
                  titleOverride={`${i + 1}/${canvases?.length}`}
                  exclude={exclude}
                  itemUrl={itemUrl}
                />
              </Space>
            </li>
          );
        });
      })}
    </PlainList>
  );
};

export default IIIFItemList;
