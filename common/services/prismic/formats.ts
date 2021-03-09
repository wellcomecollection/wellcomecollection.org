import { Format } from '@weco/common/model/format';
import { parseTitle, asHtml } from './parsers';

type FormatDoc = {
  id: string;
  data: {
    title: Record<string, unknown>;
    description: Record<string, unknown>;
  };
};

export function parseFormat(format: FormatDoc): Format {
  const data = format.data;
  return {
    id: format.id,
    title: parseTitle(data.title),
    description: asHtml(data.description),
  };
}
