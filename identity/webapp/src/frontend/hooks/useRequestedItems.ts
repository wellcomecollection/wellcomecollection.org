import { useState } from 'react';
import axios from 'axios';
import { RequestsList } from '@weco/common/model/requesting';
import {
  abortErrorHandler,
  useAbortSignalEffect,
} from '@weco/common/hooks/useAbortSignalEffect';

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
      const items = await axios.get('/account/api/users/me/item-requests', {
        signal: abortSignal,
      });
      if (items.data) {
        setRequestedItems(items.data);
        setState('success');
      }
    } catch (e) {
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
