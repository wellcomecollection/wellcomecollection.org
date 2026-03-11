import {
  ECSClient,
  UpdateServiceCommand,
  waitUntilServicesStable,
} from '@aws-sdk/client-ecs';

import { logInfo, logSuccess } from '@weco/common/utils/console-logs';

/**
 * Trigger a new ECS deployment without changing the task definition.
 *
 * This forces ECS to pull a fresh image from ECR even if the tag hasn't changed,
 * which is necessary after retagging an image in ECR.
 *
 * @param client - Authenticated ECS client
 * @param cluster - ECS cluster name
 * @param service - ECS service name
 */
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

/**
 * Wait for an ECS service deployment to complete and stabilize.
 *
 * Polls every 6 seconds for up to 10 minutes. A service is considered stable when:
 * - The deployment is complete
 * - All desired tasks are running
 * - No tasks are in PENDING state
 *
 * @param client - Authenticated ECS client
 * @param cluster - ECS cluster name
 * @param service - ECS service name
 */
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
