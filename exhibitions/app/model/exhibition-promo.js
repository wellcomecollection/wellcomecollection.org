// @flow
import {model} from 'common';
const {UiComponent, Picture} = model;

export type ExhibitionPromo = UiComponent & {
  id?: ?String;
  url?: ?string;
  title: string;
  image?: ?Picture;
  description?: string;
  start?: ?Date;
  end?: ?Date;
}
