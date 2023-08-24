import { fetchJson } from '@weco/common/utils/http';
import { IIIFImage } from '../types/image/v2';

export async function fetchIIIFImageJson(
  location: string
): Promise<IIIFImage | undefined> {
  try {
    const imageJson = await fetchJson(location);
    return imageJson;
  } catch (e) {}
}
