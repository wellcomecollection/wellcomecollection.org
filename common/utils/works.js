// @flow
import { type Work } from '../model/work';

export function getPhysicalLocations(work: Work) {
  return work.items
    .map(item =>
      item.locations.filter(location => location.type === 'PhysicalLocation')
    )
    .reduce((acc, locations) => acc.concat(locations), []);
}

export function getDigitalLocations(work: Work) {
  return work.items
    .map(item =>
      item.locations.filter(location => location.type === 'DigitalLocation')
    )
    .reduce((acc, locations) => acc.concat(locations), []);
}

export function getProductionDates(work: Work) {
  return work.production
    .map(productionEvent => productionEvent.dates.map(date => date.label))
    .reduce((a, b) => a.concat(b), []);
}

const workTypeIcons = {
  'e-books': 'book',
  books: 'book',
};
export function getWorkTypeIcon(work: Work): ?string {
  return workTypeIcons[work.workType.label.toLowerCase()];
}
