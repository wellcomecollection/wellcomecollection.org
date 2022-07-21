import title from '../parts/title';
import { multiLineText } from '../parts/structured-text';

export default function label(label: string) {
  return {
    [label]: {
      title,
      description: multiLineText({ label: 'Description' }),
    },
  };
}
