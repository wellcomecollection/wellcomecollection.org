import { TransformedCanvas } from '@weco/content/types/manifest';
import { fetchJson } from '@weco/content/utils/http';

export type TextJson = {
  items?: {
    body: {
      type: string;
      value: string;
    };
  }[];
};

export async function fetchCanvasOcr(
  canvas: TransformedCanvas | undefined
): Promise<TextJson | undefined> {
  if (canvas?.textServiceId) {
    try {
      const textJson = await fetchJson(
        encodeURI(canvas.textServiceId as string)
      );
      return textJson;
    } catch (e) {
      console.warn(e);
    }
  }
}
