// @flow
type SeriesDimension = {|
  id: string,
  title: string
|}

export type AnalyticsDimensions = {|
  version: 1 | 2,
  format: ?string,
  series: SeriesDimension[],
  positionInSeries: ?number,
  testCohort: ?string,
  dataType: 'list' | 'item',
  referringComponent: ?Object,
  pageState: ?Object
|}
