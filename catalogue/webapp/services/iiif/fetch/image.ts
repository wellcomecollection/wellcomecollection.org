import { fetchJson } from '@weco/common/utils/http';
import { Image } from '../types/image/v2';

export async function fetchIIIFImageJson(
  location: string
): Promise<Image | undefined> {
  try {
    const imageJson = await fetchJson(location);
    return imageJson;
  } catch (e) {}
}
