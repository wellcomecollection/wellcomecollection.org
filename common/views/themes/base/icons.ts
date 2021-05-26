import { themeValues } from '../config';

export const icons = `
.icon {
  display: inline-block;
  height: ${themeValues.iconDimension}px;
  width: ${themeValues.iconDimension}px;
  position: relative;
  user-select: none;
}

.icon--match-text {
  height: 1em;
  width: 1em;
}

.icon__canvas {
  display: block;
  height: 100%;
  visibility: hidden;
}

.icon__svg {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

${Object.entries(themeValues.colors)
  .map(([key, value]) => {
    return `
    .icon--${key} {
      .icon__shape {
        fill: ${value.base};
      }

      .icon__stroke {
        stroke: ${value.base};
      }
    }`;
  })
  .join(' ')}


.icon--45 {
  transform: rotate(45deg);
}

.icon--90 {
  transform: rotate(90deg);
}

.icon--180 {
  transform: rotate(180deg);
}

.icon--270 {
  transform: rotate(270deg);
}

.icon-rounder {
  border: 2px solid ${themeValues.color('currentColor')};
  border-radius: 50%;
  width: 46px;
  height: 46px;
}
`;
