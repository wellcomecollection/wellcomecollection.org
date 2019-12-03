// @flow
import fetch from 'isomorphic-unfetch';

const rootUris = {
  prod: 'https://api.wellcomecollection.org/stacks/v1/requests',
};

type Environment = {|
  env?: $Keys<typeof rootUris>,
|};

type RequestItemsProps = {|
  itemId: string,
  token: string,
  ...Environment,
|};

type GetUserHoldsProps = {|
  token: string,
  ...Environment,
|};

export async function requestItem({
  itemId,
  token,
  env = 'prod',
}: RequestItemsProps) {
  const url = rootUris[env];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ itemId: itemId }),
  }).then(r => {
    if (r.status === 200) return r.json();
    console.error('invalid /requests', r);
  });

  return response;
}

export async function getUserHolds({ token, env = 'prod' }: GetUserHoldsProps) {
  const url = rootUris[env];

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  }).then(r => {
    if (r.status === 200) return r;
    console.error('invalid /requests', r);
  });

  return response.json();
}
