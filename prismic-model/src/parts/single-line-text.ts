import structuredText from './structured-text';

export default function singleLineText(label = 'Title', type = 'paragraph') {
  return structuredText({
    label,
    allowMultipleParagraphs: false,
    allTextOptions: [type],
  });
}
