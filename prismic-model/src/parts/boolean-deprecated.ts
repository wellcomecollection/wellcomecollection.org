import select from './select';

export default function (label: string) {
  return select(label, { options: ['yes'] });
}
