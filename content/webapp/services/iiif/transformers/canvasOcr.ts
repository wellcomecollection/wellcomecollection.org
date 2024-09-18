import { TextJson } from '@weco/content/services/iiif/fetch/canvasOcr';
import { missingAltTextMessage } from '@weco/content/services/wellcome/catalogue/works';

export function transformCanvasOcr(
  textJson: TextJson | undefined
): string | undefined {
  return (
    textJson?.items
      ?.filter(item => {
        return item.body.type === 'TextualBody';
      })
      .map(item => item.body.value)
      .join(' ') || missingAltTextMessage
  );
}
