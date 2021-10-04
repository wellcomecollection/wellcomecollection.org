import axios from 'axios';
import { useEffect, useState } from 'react';
import { RequestsList } from '@weco/common/model/requesting';
import { callMiddlewareApi } from '../../utility/middleware-api-client';

// TODO the requests API should be able to handle the "me" userId
export function useRequestedItems(userId?: string): RequestsList | undefined {
  const [requestedItems, setRequestedItems] = useState<
    RequestsList | undefined
  >();

  useEffect(() => {
    const cancelSource = axios.CancelToken.source();
    async function fetchRequests() {
      if (userId) {
        try {
          const items = await callMiddlewareApi(
            'GET',
            `/account/api/users/${userId}/item-requests`,
            undefined,
            {
              cancelToken: cancelSource.token,
            }
          );
          if (items.data) {
            setRequestedItems(items.data);
          }
        } catch (error) {
          if (!axios.isCancel(error)) {
            throw error;
          }
        }
      }
    }

    fetchRequests();

    return cancelSource.cancel;
  }, [userId]);

  return requestedItems;
}
