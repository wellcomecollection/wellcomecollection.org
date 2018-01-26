// @flow
import type {License} from '../../../model/license';

export const name = 'License';
export const status = 'graduated';
export const collated = true;

const license = ({
  subject: 'image.jpg',
  licenseType: 'CC-0'
}: License);

export const variants = [
  {
    name: 'default',
    label: 'CC0',
    context: license
  },
  {
    name: 'CC BY',
    label: 'CC BY',
    context: Object.assign({}, license, {licenseType: 'CC-BY'})
  },
  {
    name: 'CC BY-NC',
    label: 'CC BY-NC',
    context: Object.assign({}, license, {licenseType: 'CC-BY-NC'})
  },
  {
    name: 'CC BY-NC-ND',
    label: 'CC BY-NC-ND',
    context: Object.assign({}, license, {licenseType: 'CC-BY-NC-ND'})
  },
  {
    name: 'PDM',
    label: 'PDM',
    context: Object.assign({}, license, {licenseType: 'PDM'})
  },
  {
    name: 'copyright not cleared',
    context: Object.assign({}, license, {licenseType: 'copyright-not-cleared'})
  }
];
