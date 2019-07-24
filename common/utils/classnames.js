// @flow
export type SizeMap = { [string]: number };
type SpacingCssProps = 'margin' | 'padding';
type SpacingCssPropValues = 'top' | 'bottom' | 'left' | 'right';
type SpacingProps = { [SpacingCssProps]: SpacingCssPropValues[] };

export function withModifiers(
  className: string,
  modifiers: { [string]: boolean } = {}
): string {
  return Object.keys(modifiers).reduce((acc, curr) => {
    return modifiers[curr] ? ` ${acc} ${className}--${curr}` : ` ${acc}`;
  }, className);
}

export function spacing(sizes: SizeMap, properties: SpacingProps): string {
  return Object.keys(sizes)
    .map(key => {
      const size = sizes[key];

      return Object.keys(properties)
        .map(property => {
          const directions = properties[property];

          return directions
            .map(direction => {
              return `${property}-${direction}-${key}${size}`;
            })
            .join(' ');
        })
        .join(' ');
    })
    .join(' ');
}

export function grid(sizes: SizeMap): string {
  const base = 'grid__cell';
  const modifierClasses = Object.keys(sizes).map(key => {
    const size = sizes[key];
    const modifier = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    return `${base}--${modifier}${size}`;
  });

  return [base].concat(modifierClasses).join(' ');
}

export function cssGrid(sizes: SizeMap): string {
  const base = 'css-grid__cell';
  const modifierClasses = Object.keys(sizes).map(key => {
    const size = sizes[key];
    const modifier = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    return `${base}--${modifier}${size}`;
  });

  return [base].concat(modifierClasses).join(' ');
}

type FontFamily = 'hnl' | 'hnm' | 'wb' | 'lr';
type FontSize = 1 | 2 | 3 | 4 | 5 | 6;
export function font(family: FontFamily, size: FontSize) {
  return `font-${family} font-size-${size}`;
}

type ClassNames = string[] | { [string]: boolean };
export function classNames(classNames: ClassNames): string {
  if (Array.isArray(classNames)) {
    return classNames.join(' ');
  } else {
    return conditionalClassNames(classNames);
  }
}

export function conditionalClassNames(obj: { [string]: boolean }): string {
  return Object.keys(obj)
    .map(key => {
      if (obj[key]) {
        return key;
      }
    })
    .filter(Boolean)
    .join(' ');
}
