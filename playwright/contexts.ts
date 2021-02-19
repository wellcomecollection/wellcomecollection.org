import { baseUrl } from './test/helpers/urls';

const multiVolumeItem = async (): Promise<void> => {
  await page.goto(`${baseUrl}/works/mg56yqa4/items`);
};

export { multiVolumeItem };
