import { missingAltTextMessage } from '@weco/content/services/wellcome/catalogue/works';
import { TextJson } from '../fetch/canvasOcr';

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
