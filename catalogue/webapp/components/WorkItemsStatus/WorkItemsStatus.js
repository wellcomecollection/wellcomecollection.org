// @flow
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import { useEffect, useState, Fragment } from 'react';
import { type Work } from '@weco/common/model/work';
import Space from '@weco/common/views/components/styled/Space';
import { Tag } from '@weco/common/views/components/Tags/Tags';
import { classNames, font } from '@weco/common/utils/classnames';
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

  async function requestItem(token: string) {
    const request = await fetch(
      `https://api.wellcomecollection.org/stacks/v1/requests`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ itemId: item.id }),
      }
    ).then(r => {
      if (r.status === 200) return r.json();
      console.error('invalid /requests');
    });

    return request;
  }

  useEffect(() => {
    const action = Router.query.action;
    if (action.startsWith('requestItem:')) {
      const match = action.match(/requestItem:\/works\/[a-z0-9]+\/items\/(.*)/);
      if (match && match[1]) {
        // TODO: POST to request the item
      }
    }
  }, []);

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
                {authState}
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
                      requestItem(token.id_token);
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

const WorkItemsRequest = ({ work }: Props) => {
  const [
    physicalLocations,
    setPhysicalLocations,
  ] = useState<?PhysicalLocations>();

  useEffect(() => {
    fetch(
      `https://api.wellcomecollection.org/stacks/v1/items/works/${work.id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '0yYzrX1sqNoHCO2mzvND4b3BYTg8elYxFyMYw7c0',
        },
      }
    )
      .then(resp => resp.json())
      .then(setPhysicalLocations)
      // TODO: Send to sentry
      .catch(console.error);
  }, []);

  return physicalLocations ? (
    <>
      {physicalLocations.items.map(item => (
        <Fragment key={item.id}>
          <Space
            v={{
              size: 'xl',
              properties: ['margin-bottom'],
            }}
            className="flex flex--v-center"
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
    </>
  ) : null;
};

export default WorkItemsRequest;
