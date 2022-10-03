import keyword from './keyword';

export default function () {
  return {
    type: 'Slice',
    fieldset: 'Table',
    'non-repeat': {
      caption: keyword('Table caption (heading)'),
      tableData: keyword('Pipe-delimited csv'),
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
