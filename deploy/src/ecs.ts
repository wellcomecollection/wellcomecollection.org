import {
  ECSClient,
  UpdateServiceCommand,
  waitUntilServicesStable,
} from '@aws-sdk/client-ecs';

import { logInfo, logSuccess } from './logger';

export async function forceNewDeployment(
  client: ECSClient,
  cluster: string,
  service: string
): Promise<void> {
  logInfo(`Forcing new deployment of ${service} in ${cluster}...`);

  await client.send(
    new UpdateServiceCommand({
      cluster,
      service,
      forceNewDeployment: true,
    })
  );

  logSuccess('Triggered deployment');
}

export async function waitForServiceStable(
  client: ECSClient,
  cluster: string,
  service: string
): Promise<void> {
  logInfo(
    `Waiting for ${service} to become stable (this may take a few minutes)...`
  );

  await waitUntilServicesStable(
    { client, maxWaitTime: 600, minDelay: 6, maxDelay: 6 },
    { cluster, services: [service] }
  );

  logSuccess(`${service} is stable`);
}
