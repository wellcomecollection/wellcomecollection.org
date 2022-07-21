import structuredText from './structured-text';

export default function heading({
  label = 'Title',
  level = 1,
}: {
  label: string;
  level?: 1 | 2 | 3;
}) {
  return structuredText({
    label,
    allowMultipleParagraphs: false,
    allTextOptions: [`heading${level}`],
  });
}
