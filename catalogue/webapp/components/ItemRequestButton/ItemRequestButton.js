// @flow
import { useEffect, useState } from 'react';
import { Tag } from '@weco/common/views/components/Tags/Tags';
import { classNames, font } from '@weco/common/utils/classnames';
import { type PhysicalItemWithStatus } from '@weco/common/utils/works';

import { requestItem, getUserHolds } from '../../services/stacks/requests';
import useAuth from '@weco/common/hooks/useAuth';

type Props = {| item: PhysicalItemWithStatus, workId: string |};
const ItemRequestButton = ({ item, workId }: Props) => {
  const [requestedState, setRequestedState] = useState<string>('unknown');

  function setRedirectCookie(workId: string, itemId: string) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('action', `requestItem:/works/${workId}/items/${item.id}`);

    const url = `${window.location.pathname}?${searchParams.toString()}`;
    document.cookie = `WC_auth_redirect=${url}; path=/`;
  }

  const authState = useAuth();

  function updateRequestedState() {
    if (authState.type === 'authorized') {
      getUserHolds({ token: authState.token.id_token })
        .then(userHolds => {
          const itemsOnHold = userHolds.results.map(hold => {
            return hold.item.id;
          });

          if (itemsOnHold.includes(item.id)) {
            setRequestedState('requested');
          }
        })
        .catch(console.error);
    }
  }

  function makeRequest(itemId: string) {
    if (authState.type === 'authorized') {
      requestItem({
        itemId: itemId,
        token: authState.token.id_token,
      })
        .then(_ => setRequestedState('requested'))
        .catch(console.error);
    }
  }

  useEffect(() => {
    updateRequestedState();
  }, [authState]);

  return item.status && item.status.label === 'Available' ? (
    <Tag
      className={classNames({
        'line-height-1': true,
        'inline-block bg-green font-white': true,
        'bg-hover-black': true,
        'border-color-green border-width-1': true,
      })}
    >
      <div className={`${font('hnm', 5)}`}>
        {(function() {
          if (authState.type === 'authorized') {
            if (requestedState === 'requested') {
              return 'You have requested this item';
            } else {
              return (
                <a
                  data-test-id="libraryRequestCTA"
                  href={'#'}
                  onClick={event => {
                    event.preventDefault();
                    makeRequest(item.id);
                  }}
                >
                  Request to view in the library
                </a>
              );
            }
          } else if (authState.type === 'unauthorized') {
            return (
              <a
                data-test-id="libraryLoginCTA"
                href={authState.loginUrl}
                onClick={event => {
                  setRedirectCookie(workId, item.id);
                }}
              >
                Login to request and view in the library
              </a>
            );
          }
        })()}
      </div>
    </Tag>
  ) : null;
};

export default ItemRequestButton;
