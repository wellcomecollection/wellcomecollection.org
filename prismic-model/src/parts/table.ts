import text from './text';

export default function () {
  return {
    type: 'Slice',
    fieldset: 'Table',
    'non-repeat': {
      caption: text('Table caption (heading)'),
      tableData: text('Pipe-delimited csv'),
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
