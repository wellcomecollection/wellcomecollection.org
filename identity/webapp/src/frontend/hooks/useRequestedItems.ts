import { useEffect, useState } from 'react';
import { RequestsList } from '@weco/common/model/requesting';
import { callMiddlewareApi } from '../../utility/middleware-api-client';

// TODO the requests API should be able to handle the "me" userId
export function useRequestedItems(userId?: string): RequestsList | undefined {
  const [requestedItems, setRequestedItems] = useState<
    RequestsList | undefined
  >();

  useEffect(() => {
    async function fetchRequests() {
      if (userId) {
        const items = await callMiddlewareApi(
          'GET',
          `/account/api/users/${userId}/item-requests`
        );
        if (items.data) {
          setRequestedItems(items.data);
        }
      }
    }
    fetchRequests();
  }, [userId]);

  return requestedItems;
}
