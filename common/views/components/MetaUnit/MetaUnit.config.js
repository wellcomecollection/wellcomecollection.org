// // @flow
import type {MetaUnitProps} from '../../../model/meta-unit';
import {createMetaUnit} from '../../../model/meta-unit';

export const name = 'Meta unit';
export const collated = true;

const metaUnit = createMetaUnit(({
  headingLevel: 3,
  headingText: 'Curabitur quis',
  text: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis mollis turpis, eu facilisis ex. Vivamus sollicitudin pulvinar arcu sagittis posuere. Fusce a congue mauris. Vestibulum faucibus vel nibh ut commodo.'],
  includeDivider: true
}: MetaUnitProps));

export const context = metaUnit;

export const variants = [
  {
    name: 'links',
    context: Object.assign({}, metaUnit, {text: [], links: [{text: 'Warlock', url: '#'}, {text: 'Witch', url: '#'}, {text: 'Gallows', url: '#'}]})},
  {
    name: 'multiple paragraphs',
    context: Object.assign({}, metaUnit, {text: ['Fusce a congue mauris. Vestibulum faucibus vel nibh ut commodo.', 'Curabitur quis mollis turpis, eu facilisis ex.', 'Vivamus sollicitudin pulvinar arcu sagittis posuere. Fusce a congue mauris.']})
  }
];
