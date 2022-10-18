import { Image } from '../types/image/v2';
import { TransformedImageJSON } from '../../../types/image';
export function transformImageJSON(imageJSON: Image): TransformedImageJSON {
  return {
    width: imageJSON.width,
    height: imageJSON.height,
  };
}
