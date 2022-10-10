import title from '../parts/title';
import { multiLineText } from '../parts/text';

export default function label(label: string) {
  return {
    [label]: {
      title,
      description: multiLineText('Description'),
    },
  };
}
