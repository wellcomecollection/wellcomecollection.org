import { FunctionComponent, useEffect, useState } from 'react';

import { useUserContext } from '@weco/common/contexts/UserContext';
import {
  abortErrorHandler,
  useAbortSignalEffect,
} from '@weco/common/hooks/useAbortSignalEffect';
import ExpandableList from '@weco/content/components/ExpandableList';
import PhysicalItemDetails from '@weco/content/components/PhysicalItemDetails';
import {
  PhysicalItem,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWorkItemsClientSide } from '@weco/content/services/wellcome/catalogue/works';
import {
  itemIsRequestable,
  itemIsTemporarilyUnavailable,
} from '@weco/content/utils/requesting';
import { getItemsWithPhysicalLocation } from '@weco/content/utils/works';

type Props = {
  work: Work;
  items: PhysicalItem[];
};

/**
 * We need to know two things for an item: if it is requestable and if it is available (e.g. someone could have them on hold). The ItemsState type refers to their availability status.
 *
 * Non-requestable items are never available. Therefore, their availability status is considered to be "up-to-date"; it'll never change.
 *
 * Requestable items may or may not be available, so we have to confirm their availability status every time. Therefore, their availability status is considered "stale"; meaning it needs to be renewed/refetched.
 * @stale Requestable items
 * @up-to-date Non-requestable items
 */
type ItemsState = 'stale' | 'up-to-date';

const getItemsState = (items: PhysicalItem[]): ItemsState => {
  return items.some(itemIsTemporarilyUnavailable) ||
    items.some(item => itemIsRequestable(item))
    ? 'stale'
    : 'up-to-date';
};

const PhysicalItems: FunctionComponent<Props> = ({
  work,
  items: workItems,
}: Props) => {
  const { state: userState } = useUserContext();
  const [userHolds, setUserHolds] = useState<Set<string>>();
  const [physicalItems, setPhysicalItems] = useState(workItems);

  // https://github.com/wellcomecollection/wellcomecollection.org/issues/7120#issuecomment-938035546
  const [itemsState, setItemsState] = useState(getItemsState(workItems));

  useEffect(() => {
    setItemsState(getItemsState(workItems));
    setPhysicalItems(workItems);
  }, [work]);

  useAbortSignalEffect(
    signal => {
      const fetchUserHolds = async () => {
        const holdsResponse = await fetch(
          '/account/api/users/me/item-requests',
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
        const items = await getWorkItemsClientSide(work.id, signal);

        if (items.type !== 'Error') {
          setPhysicalItems(getItemsWithPhysicalLocation(items.results));
          setItemsState('up-to-date');
        } else {
          // If we come down this branch, we'll never update the loading state
          // on the items.
          //
          // We should reconsider thee behaviour here, e.g. providing an error
          // message or asking the user to reload the page; in the meantime at
          // least log so we know what's up.
          //
          // tell the user something about not being able to retrieve the status of the item(s)
          // we may find we run into 429s from our rate limiting, so worth bearing in mind that we might want to handle that as a separate case
          console.warn(`Unable to get up-to-date status of items: ${items}`);
        }
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
