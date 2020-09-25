import text from './text';

export default function() {
  return {
    type: 'Slice',
    fieldset: 'Table',
    'non-repeat': {
      tableData: text('Table data', 'Pipe-delimeted csv'),
      caption: text('Caption', 'Table caption (heading)'),
      hasRowHeaders: {
        type: 'Boolean',
        config: {
          default_value: false,
          label: 'Make first column bold (instead of first row)',
        },
      },
    },
  };
}
