import { FunctionComponent, useState, useEffect } from 'react';
import PhysicalItemDetails from '../PhysicalItemDetails/PhysicalItemDetails';
import {
  PhysicalItem,
  ItemsList,
  Work,
  CatalogueApiError,
} from '@weco/common/model/catalogue';
import { isCatalogueApiError } from '../../pages/api/works/items/[workId]';
import ExpandableList from '@weco/common/views/components/ExpandableList/ExpandableList';

async function fetchWorkItems(
  workId: string
): Promise<ItemsList | CatalogueApiError> {
  const items = await fetch(`/api/works/items/${workId}`);
  const itemsJson = await items.json();
  return itemsJson;
}

type Props = {
  work: Work;
  items: PhysicalItem[];
  encoreLink: string | undefined;
};

const PhysicalItems: FunctionComponent<Props> = ({
  work,
  items,
  encoreLink,
}: Props) => {
  const [physicalItems, setPhysicalItems] = useState(items);

  useEffect(() => {
    const addStatusToItems = async () => {
      const items = await fetchWorkItems(work.id);
      if (!isCatalogueApiError(items)) {
        const mergedItems = physicalItems.map(currentItem => {
          const matchingItem = items.results?.find(
            item => item.id === currentItem.id
          );
          return {
            ...matchingItem,
            ...currentItem,
          };
        });
        setPhysicalItems(mergedItems);
      }
      // else {
      // tell the user something about not being able to retrieve the status of the item(s)
      // we may find we run into 429s from our rate limiting, so worth bearing in mind that we might want to handle that as a separate case
      // }
    };
    addStatusToItems();
  }, []);

  return (
    <ExpandableList
      listItems={physicalItems.map((item, index) => (
        <PhysicalItemDetails
          item={item}
          work={work}
          encoreLink={encoreLink}
          isLast={index === physicalItems.length - 1}
          key={index}
        />
      ))}
      initialItems={5}
    />
  );
};

export default PhysicalItems;
