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

const apiUrl = getApiUrl(true); // TODO determine whether to use stage
const apiKey = getApiKey(true); // TODO determine whether to use stage
// TODO single function that takes method, etc. ?
async function requestItem({ accessToken, userId, value }) {
  try {
    const response = await fetch(`${apiUrl}/users/${userId}/item-requests`, {
      method: 'POST',
      body: JSON.stringify(value),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-api-key': apiKey ?? '',
      },
    });
    const status = response.status;
    const body = await response.text();
    return {
      status,
      body,
    };
  } catch (error) {
    return {
      status: error.statusCode || error.status || 500,
      body: {
        message: error.message,
      },
    };
  }
}

async function fetchItemRequests({ accessToken, userId }) {
  try {
    const response = await fetch(`${apiUrl}/users/${userId}/item-requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-api-key': apiKey ?? '',
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
      status: error.statusCode || error.status || 500,
      body: {
        message: error.message,
      },
    };
  }
}

export const itemRequests: RouteMiddleware<{ user_id: string }> = async context => {
  // const isAuthenticated = context.isAuthenticated();
  const accessToken = context.state.user.accessToken;
  const userId = context.params.user_id;

  if (context.request.method === 'POST') {
    const value = context.request.body;
    const request = await requestItem({
      accessToken,
      userId,
      value,
    });
    context.response.status = request.status;
    context.response.body = request.body;
  }

  if (context.request.method === 'GET') {
    const requests = await fetchItemRequests({
      accessToken,
      userId,
    });
    context.response.status = requests.status;
    context.response.body = requests.body;
  }
};
