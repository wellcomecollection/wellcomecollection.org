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
import { withPrefix } from '@weco/identity/src/frontend/MyAccount/UserInfoContext/UserInfoContext';

async function fetchWorkItems(
  workId: string
): Promise<ItemsList | CatalogueApiError> {
  const items = await fetch(withPrefix(`/api/works/items/${workId}`));
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
    let isMounted = true;
    const updateItemsStatus = async () => {
      const items = await fetchWorkItems(work.id);

      if (!isCatalogueApiError(items)) {
        const itemsWithPhysicalLocation = items.results.filter(i =>
          i.locations?.some(location => location.type === 'PhysicalLocation')
        );
        if (isMounted) {
          setPhysicalItems(itemsWithPhysicalLocation as PhysicalItem[]);
        }
      }
      // else {
      // tell the user something about not being able to retrieve the status of the item(s)
      // we may find we run into 429s from our rate limiting, so worth bearing in mind that we might want to handle that as a separate case
      // }
    };
    updateItemsStatus(); // The items api has more up to date statuses than the catalogue api
    return () => {
      // We can't cancel promises, so using the isMounted value to prevent the component from trying to update the state if it's been unmounted.
      isMounted = false;
    };
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
