import { Table } from '../types/body';
import { Props as TableProps } from '@weco/common/views/components/Table/Table';

export function transformTableCsv(tableData: string): string[][] {
  return tableData
    .trim()
    .split(/[\r\n]+/)
    .map(row => row.split('|').map(cell => cell.trim()));
}
export function transformTableSlice(slice: Table): TableProps {
  return {
    rows: slice.primary.tableData
      ? transformTableCsv(slice.primary.tableData)
      : [],
    caption: slice.primary.caption || undefined,
    hasRowHeaders: slice.primary.hasRowHeaders,
  };
}
