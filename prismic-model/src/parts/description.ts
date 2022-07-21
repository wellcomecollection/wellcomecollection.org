import structuredText from './structured-text';

const description = structuredText({
  label: 'Description',
  allowMultipleParagraphs: true,
  extraTextOptions: ['heading2'],
});

export default description;
