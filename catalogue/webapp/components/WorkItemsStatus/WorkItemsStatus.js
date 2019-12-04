// @flow
import { useEffect, useState, Fragment } from 'react';
import { type Work } from '@weco/common/model/work';
import Space from '@weco/common/views/components/styled/Space';
import { Tag } from '@weco/common/views/components/Tags/Tags';
import { classNames, font } from '@weco/common/utils/classnames';

import { getStacksWork } from '../../services/stacks/items';
import { requestItem, getUserHolds } from '../../services/stacks/requests';

import Auth from '../Auth/Auth';

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
  function setRedirectCookie(workId: string, itemId: string) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('action', `requestItem:/works/${workId}/items/${item.id}`);

    const url = `${window.location.pathname}?${searchParams.toString()}`;
    document.cookie = `WC_auth_redirect=${url}; path=/`;
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
        <Auth
          render={({ state }) => {
            return (
              <>
                {state.type === 'unauthorized' && (
                  <a
                    href={state.loginUrl}
                    onClick={event => {
                      setRedirectCookie(workId, item.id);
                    }}
                  >
                    Login to request and view in the library
                  </a>
                )}
                {state.type === 'authorized' && (
                  // TODO: Make this a button
                  <a
                    href={'#'}
                    onClick={event => {
                      event.preventDefault();
                      requestItem({
                        itemId: item.id,
                        token: state.token.id_token,
                      });
                      return false;
                    }}
                  >
                    Request to view in the library
                  </a>
                )}
                {state.type === 'authorising' && 'Authorising…'}
              </>
            );
          }}
        />
      </div>
    </Tag>
  );
};

const WorkItemsStatus = ({ work }: Props) => {
  const [
    physicalLocations,
    setPhysicalLocations,
  ] = useState<?PhysicalLocations>();

  const [authorised, setAuthorised] = useState<?string>();

  const [userHolds, setUserHolds] = useState<?Object>();

  useEffect(() => {
    getStacksWork({ workId: work.id })
      .then(setPhysicalLocations)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (authorised) {
      getUserHolds({ token: authorised })
        .then(setUserHolds)
        .catch(console.error);
    }
  }, [authorised]);

  return (
    <Auth
      render={({ state }) => {
        setAuthorised(
          state.type === 'authorized' ? state.token.id_token : null
        );

        const itemIds =
          (userHolds &&
            userHolds.holds.map(hold => hold.itemId.catalogueId.value)) ||
          [];

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
                      {itemIds.includes(item.id) ? ' (Requested)' : null}
                    </p>
                    {item.status.id === 'available' &&
                      !itemIds.includes(item.id) && (
                        <ItemRequestButton item={item} workId={work.id} />
                      )}
                  </Space>
                </Fragment>
              ))}
          </>
        );
      }}
    />
  );
};

export default WorkItemsStatus;
