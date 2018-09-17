import {london} from './format-date';

export function getTodaysGalleriesHours (galleryOpeningHours: any) {
  const todaysDate = london().startOf('day');
  const todayString = todaysDate.format('dddd');
  const regularOpeningHours = galleryOpeningHours && galleryOpeningHours.regular.find(i => i.dayOfWeek === todayString);
  const exceptionalOpeningHours = galleryOpeningHours && galleryOpeningHours.exceptional && galleryOpeningHours.exceptional.find(i => {
    const dayOfWeek = london(i.overrideDate).startOf('day');
    return todaysDate.isSame(dayOfWeek);
  });
  return exceptionalOpeningHours || regularOpeningHours;
}
