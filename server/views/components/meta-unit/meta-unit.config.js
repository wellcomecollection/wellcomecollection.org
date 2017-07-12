// @flow
import type {MetaUnit} from '../../../model/meta-unit';
import {createMetaUnit} from '../../../model/meta-unit';

export const name = 'meta-unit';
export const handle = 'meta-unit';
export const collated = true;

export const metaUnit = createMetaUnit(({
  type: 'text',
  headingLevel: 'h3',
  headingText: 'Curabitur quis',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis mollis turpis, eu facilisis ex. Vivamus sollicitudin pulvinar arcu sagittis posuere. Fusce a congue mauris. Vestibulum faucibus vel nibh ut commodo.',
  includeDivider: true
}: MetaUnit));

export const context = { model: metaUnit };

export const variants = [
  {
    name: 'date',
    context: {model: Object.assign({}, metaUnit, {type: 'date', content: [{text: '1731', datetime: '1731'}, {text: '1743', datetime: '1743'}]})}
  },
  {
    name: 'links',
    context: {model: Object.assign({}, metaUnit, {type: 'links', content: [{text: 'Warlock', url: '#'}, {text: 'Witch', url: '#'}, {text: 'Gallows', url: '#'}]})}
  }
];
