// @flow
import type {MetaUnit} from '../../../model/meta-unit';
import {createMetaUnit} from '../../../model/meta-unit';

export const name = 'meta-unit';
export const handle = 'meta-unit';
export const collated = true;

export const metaUnit = createMetaUnit(({
  headingLevel: 3,
  headingText: 'Curabitur quis',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis mollis turpis, eu facilisis ex. Vivamus sollicitudin pulvinar arcu sagittis posuere. Fusce a congue mauris. Vestibulum faucibus vel nibh ut commodo.',
  includeDivider: true
}: MetaUnit));

export const context = { model: metaUnit };

export const variants = [
  {
    name: 'links',
    context: {model: Object.assign({}, metaUnit, {type: 'links', content: [{text: 'Warlock', url: '#'}, {text: 'Witch', url: '#'}, {text: 'Gallows', url: '#'}]})}
  },
  {
    name: 'multiple paragraphs',
    context: {model: Object.assign({}, metaUnit, {type: 'links', content: ['Fusce a congue mauris. Vestibulum faucibus vel nibh ut commodo.', 'Curabitur quis mollis turpis, eu facilisis ex.', 'Vivamus sollicitudin pulvinar arcu sagittis posuere. Fusce a congue mauris.']})}
  }
];
