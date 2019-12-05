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
  const [authorised, setAuthorised] = useState<?string>();
  const [requestedState, setRequestedState] = useState<?string>();

  function setRedirectCookie(workId: string, itemId: string) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('action', `requestItem:/works/${workId}/items/${item.id}`);

    const url = `${window.location.pathname}?${searchParams.toString()}`;
    document.cookie = `WC_auth_redirect=${url}; path=/`;
  }

  function setUserHolds(token: string) {
    return getUserHolds({ token })
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
  }

  useEffect(() => {
    if (authorised) {
      setUserHolds(authorised);
    }
  }, [authorised]);

  const authState = useAuth();

  useEffect(() => {
    setAuthorised(
      authState.type === 'authorized' ? authState.token.id_token : null
    );
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
        return (
        <>
          {authState.type === 'unauthorized' && (
            <a
              href={authState.loginUrl}
              onClick={event => {
                setRedirectCookie(workId, item.id);
              }}
            >
              Login to request and view in the library
            </a>
          )}
          {authState.type === 'authorized' &&
            requestedState === 'requested' && (
              <a href={'#'}>You have requested this item</a>
            )}
          {authState.type === 'authorized' && requestedState === 'available' && (
            // TODO: Make this a button
            <a
              href={'#'}
              onClick={event => {
                event.preventDefault();
                requestItem({
                  itemId: item.id,
                  token: authState.token.id_token,
                }).then(_ => authorised && setUserHolds(authorised));
                return false;
              }}
            >
              Request to view in the library
            </a>
          )}
          {authState.type === 'authorizing' && (
            <a href={'#'}>Authorizing ...</a>
          )}
        </>
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
