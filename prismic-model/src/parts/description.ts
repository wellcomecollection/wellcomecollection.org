import structuredText from './structured-text';

const description = structuredText({
  label: 'Description',
  allowMultipleParagraphs: true,
  extraHtmlTypes: ['heading2'],
});

export default description;
