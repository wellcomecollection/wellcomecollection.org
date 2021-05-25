import { themeValues } from '../config';
import { respondTo } from '../mixins';

export const gridBase = `
.grid {
  display: flex;
  flex-wrap: wrap;
  margin-left: -${themeValues.gutter.small}px;

  ${respondTo(
    'medium',
    `
  margin-left: -${themeValues.gutter.medium}px;
  `
  )}

  ${respondTo(
    'large',
    `
  margin-left: -${themeValues.gutter.large}px;
  `
  )}
}

.grid__cell {
  flex: 1;
  padding-left: ${themeValues.gutter.small}px;

  ${respondTo(
    'medium',
    `
    padding-left: ${themeValues.gutter.medium}px;
  `
  )}

  ${respondTo(
    'large',
    `
  padding-left: ${themeValues.gutter.large}px;
  `
  )}

}`;
