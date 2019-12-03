// @flow
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
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
          render={({ authState, loginUrl, token }) => {

            return (
              <>
                {authState === 'loggedOut' && (
                  <a
                    href={loginUrl}
                    onClick={event => {
                      setRedirectCookie(workId, item.id);
                    }}
                  >
                    Login to request and view in the library
                  </a>
                )}
                {authState === 'loggedIn' && token && (
                  <a
                    href={loginUrl}
                    onClick={event => {
                      event.preventDefault();
                      requestItem({itemId: 'nope', token: token.id_token});
                      return false;
                    }}
                  >
                    Request to view in the library
                  </a>
                )}
                {authState === 'authorising' && 'Authorising…'}
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

  useEffect(() => {
    getStacksWork({'workId': work.id})
      .then(setPhysicalLocations)
      .catch(console.error);
  }, []);

  return (
    <Auth
    render={({ authState, loginUrl, token }) => {

      return (<>
        {physicalLocations.items.map(item => (
        <Fragment key={item.id}>
          <Space
            v={{
              size: 'xl',
              properties: ['margin-bottom'],
            }}
          >
            <p className="no-margin" style={{ marginRight: '10px' }}>
              {item.location.label}: {item.status.label}
            </p>
            {item.status.id === 'available' && (
              <ItemRequestButton item={item} workId={work.id} />
            )}
          </Space>
        </Fragment>
      ))}
      </>);
    }}
  />
  )
};

export default WorkItemsStatus;