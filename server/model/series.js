// @flow
export type ArticleSeries = {|
  url: string;
  name: string;
  description?: string;
  total?: number;
|}

export type Series = ArticleSeries & {|
  items: Array<ArticleSeries>;
|}
