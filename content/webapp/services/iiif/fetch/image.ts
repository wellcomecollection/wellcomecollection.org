import { IIIFImage } from '@weco/content/services/iiif/types/image/v2';
import { fetchJson } from '@weco/content/utils/http';

export async function fetchIIIFImageJson(
  location: string
): Promise<IIIFImage | undefined> {
  try {
    const imageJson = await fetchJson(location);
    return imageJson;
  } catch (e) {
    console.warn(e);
  }
}
