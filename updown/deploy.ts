import { Check, UpdownCheck } from './types';
import { getAlertRecipients, getUpdownClient } from './updown';
import checksList from './updown-checks';

type Options = {
  dryRun: boolean;
};

const deploy = async (options: Options) => {
  const client = await getUpdownClient();
  const alertRecipients = await getAlertRecipients(client);
  const configuredChecks = await client.get<UpdownCheck[]>('/checks');

  const desiredChecks: Map<string, Check> = new Map(
    checksList.map(check => [check.url, check])
  );

  for (const updownCheck of configuredChecks.data) {
    if (desiredChecks.has(updownCheck.url)) {
      const desiredCheck = desiredChecks.get(updownCheck.url)!;
      if (!options.dryRun) {
        await client.put(`/checks/${updownCheck.token}`, {
          ...updownCheck,
          alias: desiredCheck.name,
          apdex_t: desiredCheck.apdexThreshold,
          recipients: alertRecipients(desiredCheck, updownCheck),
        });
      }
      console.log(
        `Updated check for ${updownCheck.url} with name ${desiredCheck.name}`
      );
      desiredChecks.delete(updownCheck.url);
    } else {
      if (!options.dryRun) {
        await client.delete(`/checks/${updownCheck.token}`);
      }
      console.log(`Deleted check for ${updownCheck.url}`);
    }
  }

  for (const [url, check] of desiredChecks) {
    if (!options.dryRun) {
      await client.post(`/checks`, {
        url,
        alias: check.name,
        apdex_t: check.apdexThreshold,
        recipients: alertRecipients(check),
      });
    }
    console.log(`Created check for ${url} with name ${check.name}`);
  }

  // Make sure the status page has all the checks
  const statusPages =
    await client.get<{ token: string; name: string }[]>('status_pages');
  const statusPage = statusPages.data.find(
    page => page.name === 'Wellcome Collection'
  );
  const currentChecks = await client.get<UpdownCheck[]>('/checks');
  if (!options.dryRun) {
    await client.put(`/status_pages/${statusPage?.token}`, {
      ...statusPage,
      checks: currentChecks.data.map(check => check.token),
    });
  }
  console.log(`Updated status page for ${currentChecks.data.length} checks`);
};

if (require.main === module) {
  deploy({
    dryRun: false,
  });
}
