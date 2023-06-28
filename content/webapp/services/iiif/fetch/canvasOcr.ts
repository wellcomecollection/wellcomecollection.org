import { fetchJson } from '@weco/common/utils/http';
import { TransformedCanvas } from '../../../types/manifest';

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
    } catch (e) {}
  }
}
