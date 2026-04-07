import { FetchClient } from './fetch-helpers';

// Shared FetchClient instance for account API calls
export const accountApiClient = new FetchClient({ baseURL: '/account/api' });
