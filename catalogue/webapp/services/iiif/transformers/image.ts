import { IIIFImage } from '../types/image/v2';
import { TransformedImageJSON } from '../../../types/image';
export function transformImageJSON(imageJSON: IIIFImage): TransformedImageJSON {
  return {
    width: imageJSON.width,
    height: imageJSON.height,
  };
}
