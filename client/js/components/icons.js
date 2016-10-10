export default (el) => {
  const iconSpriteEl = document.getElementById('icon-sprite');
  const icons = iconSpriteEl.getElementsByTagName('symbol');

  for (let i = 0, l = icons.length; i < l; i++) {
    const iconWrapper = document.createElement('div');
    const iconHeading = document.createElement('h3');
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const useEl = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    const iconId = icons[i].id;

    iconWrapper.setAttribute('class', 'styleguide__icon-wrap');
    iconHeading.appendChild(document.createTextNode(iconId));
    iconHeading.setAttribute('class', 'styleguide__item-subheading');

    iconWrapper.appendChild(iconHeading);
    useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + iconId);
    svgEl.appendChild(useEl);
    iconWrapper.appendChild(svgEl);
    el.appendChild(iconWrapper);
  }
};
