// @flow
import type {License} from '../../../model/license';

export const name = 'license';
export const handle = 'license';
export const collated = true;

const license = ({
  subject: 'image.jpg',
  licenseType: 'CC0',
  label: 'CC0'
}: License);

export const variants = [
  {
    name: 'default',
    label: 'CC0',
    context: { model: license }
  },
  {
    name: 'CC BY',
    label: 'CC BY',
    context: { model: Object.assign({}, license, {licenseType: 'CC-BY'}) }
  },
  {
    name: 'CC BY-NC',
    label: 'CC BY-NC',
    context: { model: Object.assign({}, license, {licenseType: 'CC-BY-NC'}) }
  },
  {
    name: 'CC BY-NC-ND',
    label: 'CC BY-NC-ND',
    context: { model: Object.assign({}, license, {licenseType: 'CC-BY-NC-ND'}) }
  },
  {
    name: 'PDM',
    label: 'PDM',
    context: { model: Object.assign({}, license, {licenseType: 'PDM'}) }
  },
  {
    name: 'copyright not cleared',
    context: { model: Object.assign({}, license, {licenseType: 'copyright-not-cleared'}) }
  }
];
