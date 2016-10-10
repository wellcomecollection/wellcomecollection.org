import {nodeList} from '../util';

export default (el) => {
  const iconSpriteEl = document.getElementById('icon-sprite');
  const icons = nodeList(iconSpriteEl.getElementsByTagName('symbol'));

  icons.forEach((icon) => {
    const iconWrapper = document.createElement('div');
    const iconHeading = document.createElement('h3');
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const useEl = document.createElementNS('http://www.w3.org/2000/svg', 'use');

    iconWrapper.setAttribute('class', 'styleguide__icon-wrap');
    iconHeading.appendChild(document.createTextNode(icon.id));
    iconHeading.setAttribute('class', 'styleguide__item-subheading');

    iconWrapper.appendChild(iconHeading);
    useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + icon.id);
    svgEl.appendChild(useEl);
    iconWrapper.appendChild(svgEl);
    el.appendChild(iconWrapper);
  });
};
