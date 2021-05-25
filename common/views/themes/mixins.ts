import { themeValues } from './config';
type Breakpoint = 'small' | 'medium' | 'large' | 'xlarge';

export function respondTo(breakpoint: Breakpoint, content: string): string {
  return `@media (min-width: ${themeValues.sizes[breakpoint]}px) {
   ${content}
 }`;
}

export function respondBetween(
  minBreakpoint: Breakpoint,
  maxBreakpoint: Breakpoint,
  content: string
): string {
  return `@media (min-width: ${themeValues.sizes[minBreakpoint]}px) and (max-width: ${themeValues.sizes[maxBreakpoint]}px) {
    ${content}
  }`;
}

export const visuallyHidden = `
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
`;

export const clearfix = `
  &:before,
  &:after {
    content: '';
    display: table;
  }

  &:after {
    clear: both;
}`;
