// @flow
import fetch from 'isomorphic-unfetch';

const rootUris = {
  prod: 'https://api.wellcomecollection.org/stacks/v1/items',
};

type Environment = {|
  env?: $Keys<typeof rootUris>,
|};

type GetStacksWorkProps = {|
  workId: string,
  ...Environment,
|};

type StacksWork = Object;

export async function getStacksWork({
  workId,
  env = 'prod',
}: GetStacksWorkProps): Promise<StacksWork> {
  const url = `${rootUris[env]}/works/${workId}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '0yYzrX1sqNoHCO2mzvND4b3BYTg8elYxFyMYw7c0',
    },
  });

  return response.json();
}
