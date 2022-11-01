import { missingAltTextMessage } from '../../catalogue/works';
import { TextJson } from '../fetch/canvasOcr';

export function transformCanvasOcr(textJson: TextJson): string {
  return textJson?.items
      ?.filter(item => {
        return item.body.type === 'TextualBody';
      })
      .map(item => item.body.value)
      .join(' ') || missingAltTextMessage;
}
