import { FunctionComponent, useEffect, useState } from 'react';
import PhysicalItemDetails from '../PhysicalItemDetails/PhysicalItemDetails';
import { PhysicalItem, Work } from '@weco/common/model/catalogue';
import { isCatalogueApiError } from '../../pages/api/works/items/[workId]';
import ExpandableList from '@weco/common/views/components/ExpandableList/ExpandableList';
import {
  useAbortSignalEffect,
  abortErrorHandler,
} from '@weco/common/hooks/useAbortSignalEffect';
import { useUser } from '@weco/common/views/components/UserProvider/UserProvider';
import { getItemsWithPhysicalLocation } from '../../utils/works';
import {
  itemIsRequestable,
  itemIsTemporarilyUnavailable,
} from '../../utils/requesting';

type Props = {
  work: Work;
  items: PhysicalItem[];
};

type ItemsState = 'stale' | 'up-to-date';

const getItemsState = (items: PhysicalItem[]): ItemsState =>
  items.some(itemIsTemporarilyUnavailable) || items.some(itemIsRequestable)
    ? 'stale'
    : 'up-to-date';

const useItemsState = (
  items: PhysicalItem[]
): [ItemsState, (s: ItemsState) => void] => {
  /* https://github.com/wellcomecollection/wellcomecollection.org/issues/7120#issuecomment-938035546
   *
   * What if we don’t call the items API? There are two possible error cases:
   *
   * (1) We don’t show a “request item” button when an item is ready to request.
   *     This could occur if an item was on hold, has been returned to the stores,
   *     and we haven’t had the update through the catalogue pipeline yet.
   * (2) We show a “request item” button when an item isn’t available to request.
   *     Run the same scenario in reverse: somebody has put the item on hold,
   *     but we haven’t realised yet in the catalogue API.
   *
   * Error (2) is worse than error (1).
   *
   * To avoid them:
   *
   * Query the items API if the status is “temporarily unavailable”
   * Query the items API if you want to display a button based on the catalogue API data
   *
   * In all other cases the items API would be a no-op.
   */
  const [itemsState, setItemsState] = useState<ItemsState>(
    getItemsState(items)
  );

  useEffect(() => {
    setItemsState(getItemsState(items));
  }, [items]);

  return [itemsState, setItemsState];
};

const PhysicalItems: FunctionComponent<Props> = ({
  work,
  items: workItems,
}: Props) => {
  const { state: userState } = useUser();
  const [userHolds, setUserHolds] = useState<Set<string>>();
  const [physicalItems, setPhysicalItems] = useState(workItems);
  const [itemsState, setItemsState] = useItemsState(workItems);

  useEffect(() => {
    setPhysicalItems(workItems);
  }, [workItems]);

  useAbortSignalEffect(
    signal => {
      const fetchUserHolds = async () => {
        const holdsResponse = await fetch(
          `/account/api/users/me/item-requests`,
          {
            signal,
          }
        );
        const holds = await holdsResponse.json();
        const holdsArray = holds?.results?.map(result => result.item.id);
        setUserHolds(holdsArray && new Set(holdsArray));
      };
      if (userState === 'signedin') {
        fetchUserHolds().catch(abortErrorHandler);
      }
    },
    [userState]
  );

  useAbortSignalEffect(
    signal => {
      const updateItemsStatus = async () => {
        const itemsResponse = await fetch(`/api/works/items/${work.id}`, {
          signal,
        });
        const items = await itemsResponse.json();

        if (!isCatalogueApiError(items)) {
          setPhysicalItems(getItemsWithPhysicalLocation(items.results));
          setItemsState('up-to-date');
        }
        // else {
        // tell the user something about not being able to retrieve the status of the item(s)
        // we may find we run into 429s from our rate limiting, so worth bearing in mind that we might want to handle that as a separate case
        // }
      };

      if (itemsState === 'stale') {
        updateItemsStatus().catch(abortErrorHandler);
      }
    },
    [itemsState]
  );

  return (
    <ExpandableList
      listItems={physicalItems.map((item, index) => (
        <PhysicalItemDetails
          item={item}
          work={work}
          accessDataIsStale={itemsState === 'stale'}
          userHeldItems={userHolds}
          isLast={index === physicalItems.length - 1}
          key={index}
        />
      ))}
      initialItems={5}
    />
  );
};

export default PhysicalItems;
