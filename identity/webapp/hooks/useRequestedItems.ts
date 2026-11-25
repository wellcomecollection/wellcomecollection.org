import { useState } from 'react';

import {
  abortErrorHandler,
  useAbortSignalEffect,
} from '@weco/common/hooks/useAbortSignalEffect';
import { RequestsList } from '@weco/common/model/requesting';
import { accountApiClient } from '@weco/identity/utils/api-client';

type State = 'initial' | 'loading' | 'success' | 'failed';

type UseRequestedItems = {
  requestedItems?: RequestsList;
  fetchRequests: (abortSignal?: AbortSignal) => void;
  state: State;
};

export function useRequestedItems(): UseRequestedItems {
  const [state, setState] = useState<State>('initial');
  const [requestedItems, setRequestedItems] = useState<
    RequestsList | undefined
  >();

  async function fetchRequests(abortSignal?: AbortSignal) {
    setState('loading');
    try {
      const response = await accountApiClient.request({
        url: '/users/me/item-requests',
        method: 'GET',
        signal: abortSignal,
      });
      setRequestedItems(response.data as RequestsList);
      setState('success');
    } catch {
      if (!abortSignal?.aborted) {
        setState('failed');
      }
    }
  }

  useAbortSignalEffect(signal => {
    fetchRequests(signal).catch(abortErrorHandler);
  }, []);

  return { requestedItems, state, fetchRequests };
}
