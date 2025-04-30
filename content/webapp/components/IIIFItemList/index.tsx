import { ChoiceBody, ContentResource } from '@iiif/presentation-3';
import { FunctionComponent } from 'react';

import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import IIIFItem from '@weco/content/components/IIIFItem';
import { TransformedCanvas } from '@weco/content/types/manifest';
import { getDisplayItems } from '@weco/content/utils/iiif/v3/canvas';

type Props = {
  canvases: TransformedCanvas[] | undefined;
  exclude: (ContentResource['type'] | ChoiceBody['type'])[]; // Allows us to exclude certain types from being rendered
  placeholderId: string | undefined;
};

const IIIFItemList: FunctionComponent<Props> = ({
  canvases,
  exclude,
  placeholderId,
}) => {
  if (!canvases) return null;

  return (
    <PlainList as="ol">
      {canvases.map((canvas, i) => {
        const displayItems = getDisplayItems(canvas);

        return displayItems.map(item => {
          return (
            <li key={item.id}>
              <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
                <IIIFItem
                  placeholderId={placeholderId}
                  item={item}
                  canvas={canvas}
                  i={i}
                  titleOverride={`${i + 1}/${canvases?.length}`}
                  exclude={exclude}
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
