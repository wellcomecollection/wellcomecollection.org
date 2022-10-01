import { singleLineText } from './text';

type Props = { level: 1 | 2 | 3 };

export default function heading(label, props?: Props) {
  const level = props?.level || 1;

  return singleLineText(label, {
    overrideTextOptions: [`heading${level}`],
  });
}
