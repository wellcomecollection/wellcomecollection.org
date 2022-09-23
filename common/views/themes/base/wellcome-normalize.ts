import { themeValues } from '../config';

export const wellcomeNormalize = `
input,
button {
  border-radius: 0;
}

fieldset {
  border: 0;
  margin: 0;
  padding: 0;
}

.openseadragon-canvas:focus {
  border: 2px solid ${themeValues.newColor('yellow')}!important;
  border-width: 2px 2px 0;
}

img {
  width: 100%;
  height: auto;
}

.scale {
  transform: scale(0);
  transition: transform 500ms;
}

.scale.scale-entered {
  transform: scale(1);
}`;
