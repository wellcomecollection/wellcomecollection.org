import { FunctionComponent, useState } from 'react';
import PhysicalItemDetails from '../PhysicalItemDetails/PhysicalItemDetails';
import { PhysicalItem, Work } from '@weco/common/model/catalogue';
import { isCatalogueApiError } from '../../pages/api/works/items/[workId]';
import ExpandableList from '@weco/common/views/components/ExpandableList/ExpandableList';
import {
  useAbortSignalEffect,
  abortErrorHandler,
} from '@weco/common/hooks/useAbortSignalEffect';
import { useUser } from '@weco/common/views/components/UserProvider/UserProvider';

type Props = {
  work: Work;
  items: PhysicalItem[];
};

const PhysicalItems: FunctionComponent<Props> = ({
  work,
  items: initialItems,
}: Props) => {
  const { state: userState } = useUser();
  const [userHolds, setUserHolds] = useState<Set<string>>();
  const [physicalItems, setPhysicalItems] = useState(initialItems);

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

  useAbortSignalEffect(signal => {
    const updateItemsStatus = async () => {
      const itemsResponse = await fetch(`/api/works/items/${work.id}`, {
        signal,
      });
      const items = await itemsResponse.json();

      if (!isCatalogueApiError(items)) {
        const itemsWithPhysicalLocation = items.results.filter(i =>
          i.locations?.some(location => location.type === 'PhysicalLocation')
        );
        setPhysicalItems(itemsWithPhysicalLocation as PhysicalItem[]);
      }
      // else {
      // tell the user something about not being able to retrieve the status of the item(s)
      // we may find we run into 429s from our rate limiting, so worth bearing in mind that we might want to handle that as a separate case
      // }
    };
    updateItemsStatus().catch(abortErrorHandler); // The items api has more up to date statuses than the catalogue api
  }, []);

  return (
    <ExpandableList
      listItems={physicalItems.map((item, index) => (
        <PhysicalItemDetails
          item={item}
          work={work}
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
