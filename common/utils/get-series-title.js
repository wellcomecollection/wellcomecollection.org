import { series } from '../data/series';

export default function getSeriesTitle(arr) {
  if (!arr.length) return;

  const namedSeries = arr.find(i => series.find(s => i.name === s.name));

  if (namedSeries) {
    return namedSeries.name;
  }
}
