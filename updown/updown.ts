import axios, { AxiosInstance } from 'axios';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { Check, UpdownCheck } from './types';

const secretsManager = new SecretsManagerClient({
  region: 'eu-west-1',
});

const getSecret = async (arn: string): Promise<string | undefined> => {
  const response = await secretsManager.send(
    new GetSecretValueCommand({ SecretId: arn })
  );
  return response.SecretString;
};

export const getUpdownClient = async (): Promise<AxiosInstance> => {
  const apiKey = await getSecret('builds/updown_api_key');
  return axios.create({
    baseURL: 'https://updown.io/api',
    headers: {
      'X-API-KEY': apiKey,
    },
  });
};

export const getAlertRecipients = async (
  client: Awaited<ReturnType<typeof getUpdownClient>>
) => {
  const recipients =
    await client.get<{ id: string; type: string; name: string }[]>(
      '/recipients'
    );
  const email = recipients.data.find(r => r.type === 'email')?.id;
  const platformChannel = recipients.data.find(
    r => r.type === 'slack' && r.name.endsWith('#digital-platform')
  )?.id;
  const alertsChannel = recipients.data.find(
    r => r.type === 'slack' && r.name.endsWith('platform-alerts')
  )?.id;

  return (desiredCheck: Check, updownCheck?: UpdownCheck) => {
    const recipients = new Set(
      // Preserve any other manually configured recipients
      updownCheck?.recipients.filter(
        r => r !== email && r !== platformChannel && r !== alertsChannel
      ) ?? []
    );
    if (desiredCheck.emailAlerts && email) {
      recipients.add(email);
    }
    if (
      desiredCheck.slackAlerts?.includes('platform-channel') &&
      platformChannel
    ) {
      recipients.add(platformChannel);
    }
    if (desiredCheck.slackAlerts?.includes('alerts-channel') && alertsChannel) {
      recipients.add(alertsChannel);
    }
    return Array.from(recipients);
  };
};
