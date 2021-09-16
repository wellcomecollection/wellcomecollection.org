// $FlowFixMe (ts)
import { londonDjs } from './dates';
import type { OpeningHours } from '../model/opening-hours';

export function getTodaysGalleriesHours(galleryOpeningHours: OpeningHours) {
  const todaysDate = londonDjs().startOf('day');
  const todayString = todaysDate.format('dddd');
  const regularOpeningHours =
    galleryOpeningHours &&
    galleryOpeningHours.regular.find(i => i.dayOfWeek === todayString);
  const exceptionalOpeningHours =
    galleryOpeningHours &&
    galleryOpeningHours.exceptional &&
    galleryOpeningHours.exceptional.find(i => {
      const dayOfWeek = londonDjs(i.overrideDate).startOf('day');
      return todaysDate.isSame(dayOfWeek);
    });
  return exceptionalOpeningHours || regularOpeningHours;
}
