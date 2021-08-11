import { RouteMiddleware } from '../../types/application';
import fetch from 'isomorphic-unfetch';

function getApiUrl(useStage) {
  return useStage
    ? 'https://v1-api.stage.account.wellcomecollection.org'
    : 'https://v1-api.account.wellcomecollection.org';
}

function getApiKey(useStage) {
  return useStage ? process.env.requesting_api_key_stage : process.env.requesting_api_key_prod;
}

async function fetchItemRequests({ accessToken, apiKey = '', userId }) {
  try {
    const response = await fetch(`${getApiUrl(true)}/users/${userId}/item-requests`, {
      // TODO determine whether to use stage for getApiUrl
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-api-key': apiKey,
      },
    });
    const status = response.status;
    const body = await response.json();
    return {
      status,
      body,
    };
  } catch (error) {
    return {
      status: 500,
      body: {},
    };
  }
}

export const itemRequests: RouteMiddleware<{ user_id: string }> = async context => {
  // const isAuthenticated = context.isAuthenticated();
  const accessToken = context.state.user.accessToken;
  const userId = context.params.user_id;
  const apiKey = getApiKey(true); // TODO determine whether to use stage for getApiKey

  if (context.request.method === 'POST') {
    context.response.status = 202;
    context.response.body = {};
  }
  if (context.request.method === 'GET') {
    const requests = await fetchItemRequests({
      accessToken,
      apiKey,
      userId,
    });
    context.response.status = requests.status;
    context.response.body = requests.body;
  }
};
