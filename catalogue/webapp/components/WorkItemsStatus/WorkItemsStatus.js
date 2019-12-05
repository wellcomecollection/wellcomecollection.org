// @flow
import { useEffect, useState, Fragment } from 'react';
import { type Work } from '@weco/common/model/work';
import Space from '@weco/common/views/components/styled/Space';
import { Tag } from '@weco/common/views/components/Tags/Tags';
import { classNames, font } from '@weco/common/utils/classnames';

import { getStacksWork } from '../../services/stacks/items';
import { requestItem, getUserHolds } from '../../services/stacks/requests';
import useAuth from '@weco/common/hooks/useAuth';

type Props = {| work: Work |};

type StacksLocation = {| id: string, label: string |};
type StacksItemStatus = {| id: string, label: string |};
type StacksItem = {|
  id: string,
  location: StacksLocation,
  status: StacksItemStatus,
|};
type PhysicalLocations = {|
  id: string,
  items: StacksItem[],
|};

type ItemRequestButtonProps = {| item: StacksItem, workId: string |};
const ItemRequestButton = ({ item, workId }: ItemRequestButtonProps) => {
  const [requestedState, setRequestedState] = useState<?string>();

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
          const itemsOnHold = userHolds.holds.map(hold => {
            return hold.itemId.catalogueId.value;
          });

          if (itemsOnHold.includes(item.id)) {
            setRequestedState('requested');
          } else {
            setRequestedState('available');
          }
        })
        .catch(console.error);
    } else {
      setRequestedState('unknown');
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
        {(function() {
          switch (requestedState) {
            case 'unknown':
              const loginUrl =
                authState.type === 'unauthorized' ? authState.loginUrl : '#';

              return (
                <a
                  href={loginUrl}
                  onClick={event => {
                    setRedirectCookie(workId, item.id);
                  }}
                >
                  Login to request and view in the library
                </a>
              );

            case 'requested':
              return <a href={'#'}>You have requested this item</a>;

            case 'available':
              return (
                <a
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
        })()}
      </div>
    </Tag>
  );
};

const WorkItemsStatus = ({ work }: Props) => {
  const [
    physicalLocations,
    setPhysicalLocations,
  ] = useState<?PhysicalLocations>();

  useEffect(() => {
    getStacksWork({ workId: work.id })
      .then(setPhysicalLocations)
      .catch(console.error);
  }, []);

  return (
    <>
      {physicalLocations &&
        physicalLocations.items.map(item => (
          <Fragment key={item.id}>
            <Space
              v={{
                size: 'l',
                properties: ['margin-bottom'],
              }}
            >
              <p>
                {item.location.label}: {item.status.label}
              </p>
              <ItemRequestButton item={item} workId={work.id} />
            </Space>
          </Fragment>
        ))}
    </>
  );
};

export default WorkItemsStatus;
