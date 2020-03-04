// @flow
// import { useEffect, useState } from 'react';
import { Tag } from '@weco/common/views/components/Tags/Tags';
import { classNames, font } from '@weco/common/utils/classnames';
import { type PhysicalItemAugmented } from '@weco/common/utils/works';

import { requestItem } from '../../services/stacks/requests';
import useAuth from '@weco/common/hooks/useAuth';

type Props = {| items: PhysicalItemAugmented[] |};
const ItemRequestButton = ({ items }: Props) => {
  const authState = useAuth();

  // function updateRequestedState() {
  //   if (authState.type === 'authorized') {
  //     getUserHolds({ token: authState.token.id_token })
  //       .then(userHolds => {
  //         const itemsOnHold = userHolds.results.map(hold => {
  //           return hold.item.id;
  //         });

  //         if (itemsOnHold.includes(item.id)) {
  //           setRequestedState('requested');
  //         }
  //       })
  //       .catch(console.error);
  //   }
  // }

  async function makeRequest(items) {
    if (authState.type === 'authorized') {
      items.map(i => console.log(i.checked, i.id));
      const requestPromises = items
        .filter(item => item.checked)
        .map(item => {
          return requestItem({
            itemId: item.id,
            token: authState.token.id_token,
          })
            .then(_ => {
              console.log(_);
              // setRequestedState('requested')
            })
            .catch(err => console.log('error', err));
        });
      const allResolvedRequests = await Promise.all(requestPromises);
      console.log(allResolvedRequests);
    }
  }

  return (
    <Tag
      className={classNames({
        'line-height-1': true,
        'inline-block bg-green font-white': true,
        'bg-hover-black': true,
        'border-color-green border-width-1': true,
      })}
    >
      <div className={`${font('hnm', 5)}`}>
        {authState.type === 'authorized' && (
          <a
            data-test-id="libraryRequestCTA"
            href={'#'}
            onClick={event => {
              event.preventDefault();
              makeRequest(items);
            }}
          >
            Request to view in the library
          </a>
        )}
      </div>
    </Tag>
  );
};

export default ItemRequestButton;
