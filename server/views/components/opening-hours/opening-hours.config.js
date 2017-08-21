import { defaultPlacesOpeningHours } from '../../../model/opening-hours';

export const name = 'opening-hours';
export const label = 'opening-hours';
export const status = 'graduated';
export const hidden = true;
export const context = {
  model: {
    places: defaultPlacesOpeningHours
  }
};
